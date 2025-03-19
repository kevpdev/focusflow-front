import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatActionList } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDatePipe } from 'src/shared/pipes/custom-date.pipe';
import { TranslateTaskStatusPipe } from 'src/shared/pipes/translate-task-status.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatActionList,
    TranslateModule,
    CustomDatePipe,
    TranslateTaskStatusPipe,
    CdkDrag
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {

  @Input() task: any | null = null;

  delete(arg0: any) {
    throw new Error('Method not implemented.');
  }

  update(arg0: any) {
    throw new Error('Method not implemented.');
  }

  isExpired(arg0: any): boolean {
    return false;
  }


}
