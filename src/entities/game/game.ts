import type { GameEvent, IGame, IGamePlayers__ } from "../__types";

export default class Game implements IGame<GameEvent> {
  constructor(readonly players: IGamePlayers__) {}

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
