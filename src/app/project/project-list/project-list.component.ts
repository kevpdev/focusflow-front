import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Project } from 'src/core/models/project.model';
import { ProjectStoreService } from 'src/core/services';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [AsyncPipe,
    MatCardModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {

  projects$: Observable<Project[]> = this.projectStoreService.projects$;

  constructor(private projectStoreService: ProjectStoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projectStoreService.fetchAllProjects()
      .pipe(take(1))
      .subscribe();
  }

  openProject(projectId: number): void {
    this.router.navigate(['project', projectId]);
  }
}
