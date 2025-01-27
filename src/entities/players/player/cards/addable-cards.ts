import GameCard from "../../../cards/game-card";
import { PlayerCards } from "./cards";

export class AddablePlayerCards {
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

  with(...cards: GameCard[]) {
    return new AddablePlayerCards([...this.#values, ...cards]);
  }
}
