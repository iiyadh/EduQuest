import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddFormationDialogComponent } from './add-formation-dialog/add-formation-dialog.component';
import { FormationStudentsDialogComponent } from './formation-students-dialog/formation-students-dialog.component';
import { CoursesService } from '../../../services/courses.service';


@Component({
  selector: 'app-courses',
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})

export class CoursesComponent {
  displayedColumns: string[] = ['codeformation', 'title', 'theme', 'students','actions'];
  
  formations: any[] = [] ;



  dataSource = this.formations;

  constructor(public dialog: MatDialog,
              private coursesServices : CoursesService  
  ) {}

  private loadData() {
    this.coursesServices.getFormations().subscribe((data: any[]) => {
      this.formations = data;
      this.dataSource = [...data];
    });
  }

  ngOnInit() {
    this.loadData();
  }

  deleteFormations(codeformation: string) {
    this.coursesServices.deleteFormation(codeformation).subscribe(() => {
      this.formations = this.formations.filter(f => f.codeformation !== codeformation);
      this.dataSource = [...this.formations];
    });
    window.location.reload();
  }

  openAddFormationDialog() {
    const dialogRef = this.dialog.open(AddFormationDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        window.location.reload();
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.formations.filter(formation => 
      formation.title.toLowerCase().includes(filterValue) ||
      formation.codeformation.toLowerCase().includes(filterValue) ||
      formation.theme.toLowerCase().includes(filterValue)
    );
  }

  viewStudents(formation: any) {
    this.dialog.open(FormationStudentsDialogComponent, {
      width: '500px',
      data: {
        formation: formation,
        allFormations: this.formations
      }
    });
  }

  // openAddFormationDialog() {
  //   const dialogRef = this.dialog.open(AddFormationDialogComponent, {
  //     width: '600px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadData();
  //   });
  // }


  // deleteFormations(id : string){
  //   this.coursesServices.deleteFormation(id).subscribe(()=>
  //   {
  //     this.loadData();
  //   }
  //   )
  // }
}
