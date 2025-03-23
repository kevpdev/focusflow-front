import { EStatus } from "./enums/status.enum";
import { ETaskType } from "./enums/task-type.enum";

export class Task {
    public id: number;
    public tempId: string;
    public userId: number;
    public title: string;
    public description: string;
    public status: EStatus;
    public priority: number;
    public dueDate: Date;
    public createdAt: Date;
    public updatedAt: Date;
    public type: ETaskType;

    constructor({
        id = 0,
        tempId = '',
        userId = 0,
        title = '',
        description = '',
        status = EStatus.PENDING,
        priority = 0,
        dueDate = new Date(),
        createdAt = new Date(),
        updatedAt = new Date(),
        type = ETaskType.TASK
    }: Partial<Task> = {}) {
        this.id = id;
        this.tempId = tempId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.type = type;
    }
}

