import type { GameEvent, IGame } from "../__types";

export class WithWebSocket implements IGame<GameEvent> {
  constructor(private readonly _origin: IGame) {}

  #emit(game: IGame) {
    return;
  }

  dispatch(event: unknown) {
    const newGame = this._origin.dispatch(event);
    this.#emit(newGame);
    return newGame;
  }
}
