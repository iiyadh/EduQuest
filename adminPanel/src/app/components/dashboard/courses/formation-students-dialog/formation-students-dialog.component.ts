import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface Formation {
  title: string;
  description: string;
  theme: string;
  students: string[];
  codeformation: string;
}

@Component({
  selector: 'app-formation-students-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './formation-students-dialog.component.html',
  styleUrl: './formation-students-dialog.component.scss'
})
export class FormationStudentsDialogComponent {
  newStudent = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { 
    formation: Formation, 
    allFormations: Formation[] 
  }) {}

  removeStudent(student: string) {
    this.data.formation.students = this.data.formation.students.filter(s => s !== student);
  }
}
