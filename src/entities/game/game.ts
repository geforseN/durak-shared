import Players from "../__players/players";
import type { GameEvent, IAllowed__, IGame } from "../players/__types";

// eslint-disable-next-line no-restricted-syntax
class __MegaPlayers extends Players {
  get allowed() {
    return {
      perform(event: GameEvent): IGame {
        // ENSURE PERSON ID
        // ENSURE CAN DO SUCH THING, CHECK ROLE
      },
    };
  }
}

interface IGamePlayers {
  get allowed(): IAllowed__;
}

export default class Game implements IGame<GameEvent> {
  constructor(readonly players: IGamePlayers) {}

  #ensureIsGameEvent(event: unknown): asserts event is GameEvent {
    if (
      !(
        typeof event === "object" &&
        event !== null &&
        "player" in event &&
        typeof event.player === "object" &&
        event.player !== null &&
        "id" in event.player &&
        typeof event.player.id === "string"
      )
    ) {
      return;
    }
    throw new Error("Wrong event :)");
  }

  dispatch(event: GameEvent) {
    this.#ensureIsGameEvent(event);
    // TODO: in event - ensure player with such id is allowed to move
    // TODOt in event - ensure player is allowed to make suck move, has right role
    return this.players.allowed.perform(event);
  }
}
