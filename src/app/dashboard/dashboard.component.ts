import { Component } from '@angular/core';
import { ProjectListComponent } from '../project/project-list/project-list.component';
import { QuickActionsPanelComponent } from "./quick-actions-panel/quick-actions-panel.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [QuickActionsPanelComponent,
    ProjectListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
