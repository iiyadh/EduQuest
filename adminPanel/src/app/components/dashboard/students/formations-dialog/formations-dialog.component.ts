import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formations-dialog',
  imports: [MatDialogModule, MatListModule, MatIconModule, MatButtonModule,CommonModule],
  templateUrl: './formations-dialog.component.html',
  styleUrl: './formations-dialog.component.scss'
})
export class FormationsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {username: string, formations: string[]}) {}
}
