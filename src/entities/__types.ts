import GameCard from "./cards/game-card";
import type { CardLike } from "./players/player/cards/utils";

export interface IPlayer__ {
  x?: never;
}

export interface IPlayers__ {
  get attacker(): IAttacker__;
  get defender(): IDefender__;
}

type ISuperPlayer__ = IAttacker__ | IDefender__;

export interface IGamePlayers__<AllowedPlayer extends ISuperPlayer__ = ISuperPlayer__>
  extends IPlayers__ {
  get allowed(): Extract<ISuperPlayer__, AllowedPlayer> & IAllowed__;
  get opponent(): Exclude<ISuperPlayer__, AllowedPlayer>;
}

// TODO: should be used at the end of round and should be used with talon
export interface IPlayerCanReceiveCards {
  receive(...cards: object[]): void;
}

export interface IAllowed__ extends IPlayer__ {
  perform(event: object): IGame;
}

export interface IDefender__ extends IPlayer__ {
  role?: "Defender";
}

export interface IAttacker__ extends IPlayer__ {
  role?: "Attacker";
}

export interface IGame<T = unknown> {
  dispatch(event: T): IGame;
}

export type GameEvent =
  | { player: { id: string } }
  | { player: { id: string }; card: CardLike; slot: { id: string } };export interface CanMakeStopDefenseMove {
  perform(move: StopDefenseMove): void;
}
export type StopDefenseMove = object;
export interface CanReceiveCards {
  withCards(...cards: GameCard[]): void;
}
type AttackMove = object;

export interface CanMakeAttackMove {
  perform(move: AttackMove): void;
}
type StopAttackMove = object;

export interface CanMakeStopAttackMove {
  perform(move: StopAttackMove): void;
}
type TransferMove = object;

export interface CanMakeTransferMove {
  perform(move: TransferMove): void;
}
type DefenseMove = object;

export interface CanMakeDefenseMove {
  perform(move: DefenseMove): void;
}

