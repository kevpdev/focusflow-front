import { EStatus } from './enums/status.enum';

export class FocusSession {
  public id: number;
  public taskId: number;
  public sessionStart: Date;
  public sessionEnd: Date;
  public status: EStatus;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id = 0,
    taskId = 0,
    sessionStart = new Date(),
    sessionEnd = new Date(),
    status = EStatus.IN_PROGRESS,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: {
    id?: number;
    taskId?: number;
    sessionStart?: Date;
    sessionEnd?: Date;
    status?: EStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = id;
    this.taskId = taskId;
    this.sessionStart = sessionStart;
    this.sessionEnd = sessionEnd;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
