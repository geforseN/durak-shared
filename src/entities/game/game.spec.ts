import { describe, expect, test } from "vitest";
import Game from "./game";

describe("game", () => {
  const game = new Game({
    get allowed() {
      return {
        perform() {
          return new Game({
            get allowed(): never {
              throw new Error();
            },
          });
        },
      };
    },
  });

  test("asd", () => {
    expect(() =>
      game.dispatch({
        player: { id: "fox" },
        move: {
          type: "stop-attack",
        },
      }),
    ).toThrow("Can not make stop move by first move attacker");

    const newGame = game.dispatch({
      player: { id: "fox" },
      move: {
        type: "place-card",
        card: "7♥",
        slot: { id: "1" },
      },
    });
    
  });
});
