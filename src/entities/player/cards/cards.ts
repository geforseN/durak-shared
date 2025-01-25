import GameCard from "../../cards/game-card";

export class PlayerCards {
  readonly #values: readonly GameCard[];

  constructor(values: readonly GameCard[]) {
    this.#values = values;
  }
  
  toEnemy() {
    return {
      count: this.#values.length,
    };
  }

  toSelf() {
    return {
      values: this.#values.map((card) => card.toJSON()),
    };
  }
}
