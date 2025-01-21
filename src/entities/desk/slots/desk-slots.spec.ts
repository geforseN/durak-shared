import { describe, expect, test } from "vitest";
import { DeskSlot, slotTypes } from "./desk-slot";
import {
  __cards__,
  nonTrumpCards,
  trumpCards,
  sameSuitHigherRankFor,
  sameSuitLowerRankFor,
  Cards,
  allTrumpCards,
} from "../../../../tests/setup-cards";
import GameCard from "../../cards/game-card";

describe("desk slot", () => {
  describe("types", () => {
    test("there is 3 types", () => {
      expect(slotTypes).toHaveLength(3);
    });
  });

  const allCards = [
    ...nonTrumpCards.toArray(),
    ...trumpCards.toArray(),
  ] as const;

  describe("empty", () => {
    const makeEmptySlot = () => DeskSlot.empty();

    test("booleans", () => {
      const slot = makeEmptySlot();

      for (const value of [
        //
        slot.is("empty"),
        slot.isEmpty(),
      ]) {
        expect(value).toBe(true);
      }

      for (const value of [
        slot.isUnbeaten(),
        slot.isBeaten(),
        slot.is("unbeaten"),
        slot.is("beaten"),
      ]) {
        expect(value).toBe(false);
      }
    });

    describe("all cards @full", () => {
      test.for(allCards)("can receive card", (card) => {
        const newSlot = makeEmptySlot().with(card);

        expect(newSlot.isUnbeaten()).toBe(true);
        expect(newSlot.is("unbeaten")).toBe(true);

        expect(newSlot.is("empty")).toBe(false);
        expect(newSlot.isEmpty()).toBe(false);

        expect(newSlot.isBeaten()).toBe(false);
        expect(newSlot.is("beaten")).toBe(false);
      });
    });
  });

  describe("unbeaten", () => {
    const makeUnbeatenSlot = (attackCard: GameCard) =>
      DeskSlot.unbeaten(attackCard);

    interface Case {
      heading: string;
      cards: (cardToTest: GameCard) => readonly GameCard[];
    }

    interface Suite {
      heading: string;
      cardToTest: GameCard;
      correctCases: Case[];
      errorCases: Case[];
    }

    const sameSuitHigherRankTestCaseFor = (cards: Cards) => ({
      heading: "same suit and higher rank",
      cards: sameSuitHigherRankFor(cards),
    });

    const sameSuitLowerRankTestCaseFor = (cards: Cards) => ({
      heading: "same suit and higher rank",
      cards: sameSuitHigherRankFor(cards),
    });

    const plainCardTestCase = {
      heading: "attack card is plain",
      cardToTest: __cards__.nonTrumpCards["7♠"],
      correctCases: [
        sameSuitHigherRankTestCaseFor(nonTrumpCards),
        {
          heading: "trump card",
          cards: () => allTrumpCards,
        },
      ],
      errorCases: [sameSuitLowerRankTestCaseFor(nonTrumpCards)],
    } satisfies Suite;

    const trumpCardTestCase = {
      heading: "attack card is trump",
      cardToTest: __cards__.trumpCards["10♠"],
      correctCases: [sameSuitHigherRankTestCaseFor(trumpCards)],
      errorCases: [sameSuitLowerRankTestCaseFor(trumpCards)],
    } satisfies Suite;

    describe.for([plainCardTestCase, trumpCardTestCase] satisfies Suite[])(
      "$heading $cardToTest.asString",
      ({ cardToTest, correctCases, errorCases }: Suite) => {
        describe.for(correctCases)(
          "must become beaten with",
          ({ heading, cards }) => {
            test.concurrent.for(cards(cardToTest))(
              `${heading}: $asString`,
              (card) => {
                const slot = makeUnbeatenSlot(cardToTest);
                const newSlot = slot.with(card);
                expect(newSlot.isBeaten()).toMatchSnapshot();
              },
            );
          },
        );

        describe.for(errorCases)(
          "must not create new slot with",
          ({ heading, cards }) => {
            test.concurrent.for(cards(cardToTest))(
              `${heading}: $asString`,
              (card) => {
                const slot = makeUnbeatenSlot(cardToTest);
                expect(() => slot.with(card)).toThrowErrorMatchingSnapshot();
              },
            );
          },
        );

        test("must throw when same card is provided (check for impossible state)", () => {
          const slot = makeUnbeatenSlot(cardToTest);
          expect(() => slot.with(cardToTest))
            //
            .toThrow("__Impossible__123");
        });
      },
    );
  });
});
