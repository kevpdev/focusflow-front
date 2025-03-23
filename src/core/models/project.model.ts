import { Task } from "./task.model";

export class Project {
    id: number;
    name: string;
    description: string;
    tasks: Task[];
    userId: number;

    constructor({
        id = 0,
        name = '',
        description = '',
        tasks = [],
        userId = 0
    }: Partial<Project> = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tasks = tasks;
        this.userId = userId;
    }
}