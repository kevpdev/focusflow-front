import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EditProjectComponent } from 'src/app/project/edit-project/edit-project.component';

@Component({
  selector: 'app-quick-actions-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './quick-actions-panel.component.html',
  styleUrl: './quick-actions-panel.component.scss',
})
export class QuickActionsPanelComponent {
  constructor(private matDialog: MatDialog) {}

  addNewProject(): void {
    this.matDialog.open(EditProjectComponent, {
      data: { isEditMode: false },
      panelClass: 'my-custom-dialog',
    });
  }
}
