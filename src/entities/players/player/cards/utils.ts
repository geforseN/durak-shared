import { CardDTO } from "@durak-game/durak-dts";
import GameCard from "../../../cards/game-card";

export type CardLike = CardDTO | GameCard | `${CardDTO["rank"]}${CardDTO["suit"]}`

export function __withCardRemove(
  cards: readonly GameCard[],
  cardToFindLike: CardLike,
) {
  const predicate =
    cardToFindLike instanceof GameCard
      ? (card: GameCard) => card.isEqualTo(cardToFindLike)
      : typeof cardToFindLike === "object"
        ? (card: GameCard) =>
            card.toString() === `${cardToFindLike.rank}${cardToFindLike.suit}`
        : (card: GameCard) => card.toString() === cardToFindLike;

  const card = cards.find(predicate);
  if (!card) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    throw new Error(`Failed to find card ${cardToFindLike}`);
  }
  const newCards = cards.toSpliced(cards.indexOf(card), 1)
  return {
    cards: newCards,
    card
  }
}
