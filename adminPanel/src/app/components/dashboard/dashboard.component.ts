import { Component , OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { StudentsComponent } from './students/students.component';
import { CoursesComponent } from './courses/courses.component';
import { DepartementsComponent } from './departements/departements.component';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';


@Component({
  selector: 'app-dashboard',
  standalone :true,
  imports: [NavbarComponent,StudentsComponent,CoursesComponent,DepartementsComponent,CommonModule,StatsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  
  state = 'studentlist'

  onToggleState(state :string){
    this.state = state;
  }
}
