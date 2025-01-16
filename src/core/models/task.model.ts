
export enum ETaskStatus {
    PENDING = "PENDING",
    DONE = "DONE",
    IN_PROGRESS = "IN_PROGRESS",
    CANCELLED = "CANCELLED",
    NO_STATUS = "NO_STATUS"
}

export class Task {
    public id: number;
    public tempId: string;
    public userId: number;
    public title: string;
    public description: string;
    public status: ETaskStatus;
    public priority: number;
    public dueDate: Date;
    public createdAt: Date;
    public updatedAt: Date;

    constructor({
        id = 0,
        tempId = '',
        userId = 0,
        title = '',
        description = '',
        status = ETaskStatus.PENDING, // Remplacez par une valeur par défaut appropriée
        priority = 0,
        dueDate = new Date(),
        createdAt = new Date(),
        updatedAt = new Date(),
    }: {
        id?: number;
        tempId?: string;
        userId?: number;
        title?: string;
        description?: string;
        status?: ETaskStatus;
        priority?: number;
        dueDate?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
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
    }
}