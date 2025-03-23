import { Component, OnInit } from '@angular/core';
import { KanbanComponent } from './kanban/kanban.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [KanbanComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit {

  projectTitle: string = '';
  projectId: number | null = null;

  constructor() { }

  ngOnInit(): void {
  }


}  
