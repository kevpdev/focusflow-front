import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Project } from 'src/core/models';
import { ProjectStoreService } from 'src/core/services';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [MatNavList, RouterLink, MatIconModule, AsyncPipe, CommonModule, MatButtonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent implements OnInit {
  projects$: Observable<Project[]> = this.projectStore.projects$;
  visibleCount = 5;

  constructor(private projectStore: ProjectStoreService) {}

  ngOnInit(): void {
    this.projectStore.fetchAllProjects().pipe(take(1)).subscribe();
  }
}
