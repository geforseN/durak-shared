import { describe, expect, test } from "vitest";
import setupCards from "../../../tests/setup-cards";
import { ranks, type CardDTO } from "@durak-game/durak-dts";
import type GameCard from "../cards/game-card";

const { nonTrumpCards, trumpCards: _ } = setupCards();

interface ICard {
  isEqualTo(other: ICard): boolean;

  toString(): string;

  toJSON(): { rank: CardDTO["rank"]; suit: CardDTO["suit"] };
}

interface IDeskSlot {
  id: string;

  next(card: ICard): IDeskSlot | never;

  toJSON(): {
    id: string;
    attackCard?: ReturnType<ICard["toJSON"]>;
    defendCard?: ReturnType<ICard["toJSON"]>;
  };
}

class EmptySlot implements IDeskSlot {
  constructor(private readonly index: number) {}

  get id() {
    return String(this.index + 1);
  }

  next(card: GameCard) {
    if (card.isTrump()) {
      return new UnbeatenTrumpSlot(this.index, card);
    }
    return new UnbeatenPlainSlot(this.index, card);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}

class UnbeatenTrumpSlot implements IDeskSlot {
  constructor(
    private readonly index: number,
    private readonly attackCard: GameCard,
  ) {}

  get id() {
    return String(this.index + 1);
  }

  next(card: GameCard) {
    if (card.isPlain()) {
      throw new Error("Can not beat trump card with non trump card");
    }
    // FIXME: REPEATED #1
    if (card.rank.isLowerThan(this.attackCard.rank)) {
      throw new Error("Can not beat trump card with lower rank trump card");
    }
    return new BeatenSlot(this.index, this.attackCard, card);
  }

  // FIXME: toJSON REPEATED #2
  toJSON() {
    return {
      id: this.id,
      attackCard: this.attackCard.toJSON(),
    };
  }
}

class UnbeatenPlainSlot implements IDeskSlot {
  constructor(
    private readonly index: number,
    private readonly attackCard: GameCard,
  ) {}

  get id() {
    return String(this.index + 1);
  }

  next(card: GameCard) {
    // FIXME: isHigherThan REPEATED #1
    if (card.isPlain() && card.rank.isLowerThan(this.attackCard.rank)) {
      throw new Error("Can not beat card, provided card has lower rank");
    }
    return new BeatenSlot(this.index, this.attackCard, card);
  }

  // FIXME: toJSON REPEATED #2
  toJSON() {
    return {
      id: this.id,
      attackCard: this.attackCard.toJSON(),
    };
  }
}

class BeatenSlot implements IDeskSlot {
  constructor(
    private readonly index: number,
    private readonly attackCard: GameCard,
    private readonly defendCard: GameCard,
  ) {}

  get id() {
    return String(this.index + 1);
  }

  next(): never {
    throw new Error("Can not place card on desk slot, slot is beaten");
  }

  toJSON() {
    return {
      id: this.id,
      attackCard: this.attackCard.toJSON(),
      defendCard: this.defendCard.toJSON(),
    };
  }
}

class DeskSlots {
  constructor(readonly values: readonly IDeskSlot[]) {}

  require(predicate: (slot: IDeskSlot) => boolean) {
    const slot = this.values.find(predicate);
    if (!slot) {
      throw new Error("Failed to find slot");
    }
    return slot;
  }

  keys() {
    return this.values.map((slot) => slot.id);
  }

  toJSON() {
    return this.values.map((slot) => slot.toJSON());
  }

  with(predicate: (slot: IDeskSlot) => boolean, card: ICard): DeskSlots {
    const slot = this.require(predicate);
    const values = this.values.with(this.values.indexOf(slot), slot.next(card));
    return new DeskSlots(values);
  }
}

export interface IDesk_ {
  get size(): number;

  with(card: ICard): {
    at(predicate: (slot: IDeskSlot) => boolean): IDesk;
  };
}

export interface IDesk {
  get size(): number;

  with(card: ICard): {
    at(predicate: (slot: IDeskSlot) => boolean): IDesk;
  };

  toJSON(): { slots: unknown[] };
}

export interface IDesk2 extends IDesk {
  with(card: ICard): {
    at(predicate: (slot: IDeskSlot) => boolean): IDesk2;
  };

  with2(placeCardMove: {
    card: () => ICard;
    at: (slot: IDeskSlot) => boolean;
  }): IDesk2;
}

interface IDeskMove {
  for(desk: IDesk2): {
    card: () => ICard;
    at: (slot: IDeskSlot) => boolean;
  };
}

export interface IDeskWithMove {
  withMove(move: IDeskMove): IDeskWithMove;
}

class Desk implements IDesk, IDesk2, IDeskWithMove {
  constructor(private readonly _slots: DeskSlots) {}

  keys() {
    return this._slots.values.map((slot) => slot.id);
  }

  get size() {
    return this._slots.values.length;
  }

  with2(placeCardMove: {
    card: () => ICard;
    at: (slot: IDeskSlot) => boolean;
  }) {
    return this.with(placeCardMove.card()).at((slot) => placeCardMove.at(slot));
  }

  with(card: ICard) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- rule lint work wrong here
    const _this = this;
    return {
      at(slotPredicate: (slot: IDeskSlot) => boolean) {
        return new Desk(_this._slots.with(slotPredicate, card));
      },
    };
  }

  withMove(move: IDeskMove) {
    return this.with2(move.for(this));
  }

  toJSON() {
    return {
      slots: this._slots.toJSON(),
    };
  }
}

class SlotId<const T extends string> {
  constructor(public readonly value: T) {}
}

type FindRanks = (rank: { toString(): CardDTO["rank"] }) => CardDTO["rank"][];

const findGreaterRanksFor = ((rank: { toString(): CardDTO["rank"] }) =>
  ranks.slice(ranks.indexOf(rank.toString()))) satisfies FindRanks;

const findLowerRanksFor = ((rank: { toString(): CardDTO["rank"] }) =>
  ranks.slice(0, ranks.indexOf(rank.toString()))) satisfies FindRanks;

const makeCardFinder =
  (findRanks: FindRanks) =>
  (cards: Record<`${CardDTO["rank"]}${CardDTO["suit"]}`, GameCard>) =>
  (card: GameCard): GameCard[] => {
    const suit = card.suit.toString();
    const ranks = findRanks(card.rank);

    const keysToFind = ranks.map((rank) => `${rank}${suit}` as const);

    const allKeys = Object.keys(
      cards,
    ) as `${CardDTO["rank"]}${CardDTO["suit"]}`[];
    return allKeys
      .filter((key) => keysToFind.includes(key))
      .map((key) => cards[key]);
  };

const findGreaterSameSuitCardsFor = makeCardFinder(findGreaterRanksFor);

const findLowerSameSuitCardsFor = makeCardFinder(findLowerRanksFor);

const findGreaterSameSuitNonTrumpCardFor =
  findGreaterSameSuitCardsFor(nonTrumpCards);

const findLowerSameSuitNonTrumpCardFor =
  findLowerSameSuitCardsFor(nonTrumpCards);

const forAttacker = (desk: Desk) => ({
  includesCardWithRank: (rank) => desk.ranks.includes(rank),
});

class DeskRanks {
  constructor(private readonly deskSlotsValues: readonly IDeskSlot[]) {}

  values() {
    return new Set(
      this.deskSlotsValues
        .map((slot) => slot.toJSON())
        .flatMap((cards) => [cards.attackCard, cards.defendCard])
        .filter((card) => card !== undefined)
        .map((card) => card.rank),
    );
  }
}

class AttackableDesk implements IDesk {
  readonly #ranks: {
    values(): Set<CardDTO["rank"]>;
  };

  readonly #slots: DeskSlots;

  constructor(slots: DeskSlots) {
    this.#slots = slots;
    this.#ranks = new DeskRanks(slots.values);
  }

  get size() {
    return this.#slots.values.length;
  }

  with(card: ICard) {
    const rank = card.toJSON().rank;
    const ranks = this.#ranks.values();
    if (!ranks.has(rank)) {
      throw new Error(
        `Can not insert card with rank=${rank}, allowed values are ${[...ranks].join(", ")}`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    return {
      at(slotId: string) {
        return new Desk(_this.#slots.with((slot) => slot.id === slotId, card));
      },
    };
  }

  toJSON(): { slots: unknown[] } {
    throw new Error("Method not implemented.");
  }
}

const forDefender = (card, slotId, desk) =>
  desk
    .at((slot) => slot.id === slotId)
    .ensureIsUnbeaten()
    .then((slot) => slot.canBeBeatenWith(card));

const makeDesk = ({ size = 6 }: { size: number }) =>
  new Desk(
    new DeskSlots(Array.from({ length: size }, (_, i) => new EmptySlot(i))),
  );

interface DeskCard {}

class AttackCard implements ICard, DeskCard {
  type = "attack";

  constructor(private readonly origin: GameCard) {}

  place(desk: Desk) {}
}

class TransferCard implements ICard, DeskCard {
  type = "transfer";

  constructor(private readonly origin: GameCard) {}

  place(desk: Desk) {}
}

class DefenseCard implements ICard, DeskCard {
  type = "defense";

  constructor(private readonly origin: GameCard) {}

  place(desk: Desk) {}
}

interface IIdentifiableSlot extends IDeskSlot {
  id: string;
}
interface CanMakePlaceCardMoveForSlottableCard {
  forDesk(): {
    card: () => ICard;
    at: (slot: IIdentifiableSlot) => boolean;
  };
}

interface CanMakePlaceCardMoveForSlottableCard2 {
  for(desk: IDesk): IDesk;
}

abstract class DeskMove {
  abstract for(desk: IDesk2): {
    card: () => ICard;
    at: (slot: IIdentifiableSlot) => boolean;
  };
}

// eslint-disable-next-line no-restricted-syntax
class SlotAttack
  extends DeskMove
  implements CanMakePlaceCardMoveForSlottableCard
{
  constructor(
    private readonly slotId: string,
    private readonly card: ICard,
  ) {
    super();
  }

  forDesk(_desk: IDesk2) {
    return {
      card: () => this.card,
      at: (slot: IIdentifiableSlot) => slot.id === this.slotId,
    } as const;
  }

  for(_desk: IDesk2) {
    return this.forDesk(_desk);
  }
}

// eslint-disable-next-line no-restricted-syntax
class Transfer<T extends string> extends DeskMove {
  constructor(
    private readonly slotId: SlotId<T>,
    private readonly card: ICard,
  ) {
    super();
  }

  for(_desk: IDesk2) {
    return {
      card: () => this.card,
      at: (slot: IIdentifiableSlot) => slot.id === this.slotId.value,
    } as const;
  }
}

// eslint-disable-next-line no-restricted-syntax
class SlotDefense extends DeskMove {
  constructor(
    private readonly slotId: string,
    private readonly card: ICard,
  ) {
    super();
  }

  for(_desk: IDesk2) {
    return {
      card: () => this.card,
      at: (slot: IIdentifiableSlot) => slot.id === this.slotId,
    } as const;
  }
}

const slotAttackFor =
  <T extends string>(slotId: SlotId<T>) =>
  (card: ICard) =>
    new SlotAttack(slotId.value, card);

const slotDefenseFor =
  <T extends string>(slotId: SlotId<T>) =>
  (card: ICard) =>
    new SlotDefense(slotId.value, card);

const transferFor =
  <T extends string>(slotId: SlotId<T>) =>
  (card: ICard) =>
    new Transfer(slotId, card);

class CanBeUpdatedWithMove implements IDesk2 {
  constructor(private readonly _origin: IDesk2) {}

  get size(): number {
    throw new Error("Method not implemented.");
  }

  toJSON(): { slots: unknown[] } {
    throw new Error("Method not implemented.");
  }

  with(card: ICard) {
    return this._origin.with(card);
  }

  with2(...args: [DeskMove] | Parameters<typeof this._origin.with>) {
    if (args[0] instanceof DeskMove) {
      args[0] = args[0].for(this._origin);
    }
    return this._origin.with2(...args);
  }
}

describe("desk", () => {
  describe("with non trump attack card", () => {
    const desk = makeDesk({ size: 1 });

    const slotId = new SlotId("1");
    const attack = slotAttackFor(slotId);
    const defense = slotDefenseFor(slotId);

    const cards = nonTrumpCards;
    const attackCard = cards["10♥"];
    const greaterCards = findGreaterSameSuitNonTrumpCardFor(attackCard);
    const lowerCards = findLowerSameSuitNonTrumpCardFor(attackCard);

    const attackedDesk = desk.withMove(attack(attackCard));

    describe("defense move", () => {
      const attackCardJSON = attackCard.toJSON();

      test.for(
        greaterCards.map(
          (card) =>
            [card, defense(card)] as const satisfies [GameCard, SlotDefense],
        ),
      )(
        "can make new desk with greater card",
        ([defenseCard, slotDefenseMove]) => {
          expect(attackedDesk.withMove(slotDefenseMove).toJSON()).toEqual({
            slots: [
              {
                id: slotId.value,
                attackCard: attackCardJSON,
                defendCard: defenseCard.toJSON(),
              },
            ],
          });
        },
      );

      test.for(lowerCards.map(defense) satisfies SlotDefense[])(
        "can not make new desk with lower card",
        (slotDefenseMove) => {
          expect(() => attackedDesk.withMove(slotDefenseMove)).toThrow();
        },
      );
    });

    describe("transfer move", () => {
      test("can not be done as first move", () => {
        const desk = makeDesk({ size: 1 });

        const slotId = new SlotId("1");

        const transfer = transferFor(slotId);

        expect(() => {
          try {
            desk.withMove(transfer(nonTrumpCards["10♠"]));
          } catch (error) {
            console.trace(error);
            throw error;
          }
        }).not.toThrow();
      });
    });
  });
});
