import { describe, expect, test } from "vitest";
import setupCards from "../../../../tests/setup-cards";
import type Card from "../card";

describe("card", () => {
  const { nonTrumpCards, trumpCards } = setupCards();

  const cases = [
    {
      weaker: trumpCards["10♠"],
      stronger: trumpCards['J♠'],
    },
    {
      weaker: nonTrumpCards["10♣"],
      stronger: trumpCards["2♠"],
    },
  ] satisfies { weaker: Card; stronger: Card }[];

  test.for(cases)("$stronger does beat $weaker", ({ stronger, weaker }) => {
    expect(stronger.canBeat(weaker)).toBe(true);
  });

  test.for(cases)("$weaker does not beat $stronger", ({ weaker, stronger }) => {
    expect(weaker.canBeat(stronger)).toBe(false);
  });

  const nonTrumpCardsValues = Object.values(nonTrumpCards);

  test.for(Object.values(trumpCards))(
    "every trump card can beat every non trump card",
    (trumpCard) => {
      expect(
        nonTrumpCardsValues.every((nonTrumpCard) =>
          trumpCard.canBeat(nonTrumpCard),
        ),
      ).toBe(true);
    },
  );
});
