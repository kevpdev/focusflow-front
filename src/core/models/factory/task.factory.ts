import { BugTask } from "../bug-task.model";
import { ETaskType } from "../enums/task-type.enum";
import { Task } from "../task.model";

export class TaskFactory {

    public static createTask(task: Partial<Task>, type: ETaskType): Task {

        switch (type) {
            case ETaskType.TASK:
                return new Task(task);
            case ETaskType.BUG:
                return new BugTask(task);
            default:
                throw new Error('Task type not supported');
        }

    }


}