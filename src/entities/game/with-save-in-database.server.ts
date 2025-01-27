import type { GameEvent, IGame } from "../__types";

export class WithSaveInDatabase implements IGame<GameEvent> {
  constructor(private readonly _origin: IGame) {}

  #save(game: IGame) {
    return;
  }

  dispatch(event: unknown) {
    const newGame = this._origin.dispatch(event);
    this.#save(newGame);
    return newGame;
  }
}
