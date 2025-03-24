import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quick-actions-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './quick-actions-panel.component.html',
  styleUrl: './quick-actions-panel.component.scss',
})
export class QuickActionsPanelComponent {
  addNewProject(): void {
    console.log('add new project');
  }
}
