import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { ProjectStoreService } from 'src/core/services';
import { KanbanComponent } from './kanban/kanban.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [KanbanComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  projectTitle: string | null = null;
  projectId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectStoreService: ProjectStoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => Number(params.get('projectId'))),
        filter(projectId => !!projectId),
        switchMap(projectId => this.projectStoreService.fetchProjectById(projectId)),
        take(1)
      )
      .subscribe(project => {
        this.projectTitle = project.name;
        this.projectId = project.id;
      });
  }
}
