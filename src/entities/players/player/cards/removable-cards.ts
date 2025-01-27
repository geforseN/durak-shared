import GameCard from "../../../cards/game-card";
import { CardLike, __withCardRemove } from "./utils";
import { PlayerCards } from "./cards";

export class RemovablePlayerCards {
  readonly #values: readonly GameCard[];
  readonly #origin: PlayerCards;

  constructor(values: readonly GameCard[]) {
    this.#values = values;
    this.#origin = new PlayerCards(values);
  }

  toEnemy() {
    return this.#origin.toEnemy();
  }

  toSelf() {
    return this.#origin.toSelf();
  }

  without(cardLike: CardLike) {
    const { cards, card } = __withCardRemove(this.#values, cardLike);
    return {
      cards: new RemovablePlayerCards(cards),
      card,
    };
  }
}
