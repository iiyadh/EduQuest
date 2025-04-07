import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormationsDialogComponent } from './formations-dialog/formations-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { StudentsService } from '../../../services/students.service';


// interface Student {
//   username: string;
//   email: string;
//   departmentId: string;
//   formations: any[];
// }

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormationsDialogComponent
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})

export class StudentsComponent implements OnInit {
  
  constructor(public dialog: MatDialog,
    private studentsService: StudentsService) {}
  
  ngOnInit() {
    this.loadData();
  }



  displayedColumns: string[] = ['username', 'email', 'department', 'formations'];
  
  students: any[] = [
    // {
    //   username: 'iyadh',
    //   email: 'iyadhtabai@gmail.com',
    //   departmentId: '507f191e810c19729de860ea',
    //   formations: []
    // },
    // {
    //   username: 'john',
    //   email: 'john.doe@example.com',
    //   departmentId: '507f191e810c19729de860eb',
    //   formations: ['Math', 'Physics']
    // },
    // {
    //   username: 'jane',
    //   email: 'jane.smith@example.com',
    //   departmentId: '507f191e810c19729de860ec',
    //   formations: ['Chemistry']
    // }
  ];

  private loadData(){
    this.studentsService.getStudents().subscribe(students => {
      this.students = students as any[];
      this.dataSource = Array.isArray(students) ? [...students] : [];
    });
  }

  dataSource = this.students;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.students.filter(student => 
      student.username.toLowerCase().includes(filterValue) ||
      student.email.toLowerCase().includes(filterValue) ||
      student.departmentId.toLowerCase().includes(filterValue)
    );
  }

  viewFormations(student: any) {
    this.dialog.open(FormationsDialogComponent, {
      width: '400px',
      data: {
        username: student.username,
        formations: student.formations
      }
    });
  }
}
