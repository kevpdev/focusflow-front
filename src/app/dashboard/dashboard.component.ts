import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProjectPageComponent } from "../project/project-page/project-page.component";
import { TaskListComponent } from '../task-management/task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTabsModule,
    TaskListComponent, ProjectPageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
