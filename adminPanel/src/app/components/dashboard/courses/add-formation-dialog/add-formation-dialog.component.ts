import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CoursesService } from '../../../../services/courses.service';

@Component({
  selector: 'app-add-formation-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './add-formation-dialog.component.html',
  styleUrl: './add-formation-dialog.component.scss'
})
export class AddFormationDialogComponent {
  formation: any = {
    // _id:'',
    title: '',
    description: '',
    theme: '',
    students: [],
    codeformation: ''
  };

  constructor(
              public dialogRef: MatDialogRef<AddFormationDialogComponent>,
              private coursesServices : CoursesService
  ) {}

  save() {
    this.coursesServices.addFormation(this.formation).subscribe(
      {
        next: (formation : any) =>{
          this.coursesServices.formations = [...this.coursesServices.formations,formation];

        },
        error: (error) => console.error('Error while adding formation', error)
      }
    );
    this.dialogRef.close(this.coursesServices.formations);
  }
}
