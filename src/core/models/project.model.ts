import { Task } from './task.model';

export class Project {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  userId: number;

  constructor({
    id = 0,
    name = '',
    description = '',
    createdAt = new Date(),
    updatedAt = new Date(),
    tasks = [],
    userId = 0,
  }: Partial<Project> = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tasks = tasks;
    this.userId = userId;
  }
}
