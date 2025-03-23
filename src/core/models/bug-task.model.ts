import { ESeverity } from "./enums/severity.enum";
import { EStatus } from "./enums/status.enum";
import { ETaskType } from "./enums/task-type.enum";
import { Task } from "./task.model";

export class BugTask extends Task {
    public severity: ESeverity;

    //constructor with super()
    constructor({
        id = 0,
        tempId = '',
        projectId = 0,
        title = '',
        description = '',
        status = EStatus.PENDING,
        priority = 0,
        dueDate = new Date(),
        createdAt = new Date(),
        updatedAt = new Date(),
        type = ETaskType.BUG,
        severity = ESeverity.LOW
    }: Partial<BugTask> = {}) {
        super({
            id,
            tempId,
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            createdAt,
            updatedAt,
            type
        });
        this.severity = severity;
    }
}