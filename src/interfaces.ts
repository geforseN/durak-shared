import GameCard from "./entities/cards/game-card";

type AttackMove = object;

export interface CanMakeAttackMove {
  perform(move: AttackMove): void;
}

type StopAttackMove = object

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

export interface CanReceiveCards {
  withCards(...cards: GameCard[]): void;
}

type StopDefenseMove = object;

export interface CanMakeStopDefenseMove {
  perform(move: StopDefenseMove): void;
}
