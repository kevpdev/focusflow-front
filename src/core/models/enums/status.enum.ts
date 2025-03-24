export enum EStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  NO_STATUS = 'NO_STATUS',
}

export enum EStatusActive {
  PENDING = EStatus.PENDING,
  IN_PROGRESS = EStatus.IN_PROGRESS,
  DONE = EStatus.DONE,
}

//export type EStatusActive = EStatus.PENDING | EStatus.IN_PROGRESS | EStatus.DONE;
