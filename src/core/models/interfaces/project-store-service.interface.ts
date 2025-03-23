import { Observable } from "rxjs";
import { Project } from "../project.model";

export interface IProjectStoreService {
    getProjects(): Project[];
    fetchAllProjects(): Observable<Project[]>;
    fetchProjectById(id: number): Observable<Project>;
}