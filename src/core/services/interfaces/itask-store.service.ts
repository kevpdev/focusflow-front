import { Observable } from "rxjs/internal/Observable";
import { ETaskStatus, Task } from "../../models/task.model";

export interface ITaskStoreService {

    getTaskById(id: number): Task;
    fetchAllTasks(): void;
    fetchTasksByStatus(status: ETaskStatus): Observable<Task[]>;
    fetchAllPendingTasks(): Observable<Task[]>;
    fetchAllInProgressTasks(): Observable<Task[]>;
    fetchFinishedTasks(): Observable<Task[]>;
    updateTaskStatus(modifiedTasks: Task[]): Observable<Task[]>;
    updateTask(updatedTask: Task): Observable<Task>;
    deleteTask(id: number): Observable<void>;
    addNewTask(newTask: Task): Observable<Task>;
}
