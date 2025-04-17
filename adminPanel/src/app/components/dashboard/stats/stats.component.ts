import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType, ChartData, ChartOptions } from 'chart.js';
import { StudentsService } from "../../../services/students.service";
import { CoursesService } from "../../../services/courses.service";
import { DepartementsService } from "../../../services/departements.service";
import { forkJoin } from 'rxjs';
import { InboxComponent } from './inbox/inbox.component';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, InboxComponent, BaseChartDirective],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  totalStudents = 0;
  totalDepartments = 0;
  totalCourses = 0;

  students: any[] = [];
  departements: any[] = [];
  courses: any[] = [];

  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    }
  };
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: false }
    }
  };
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private departementsService: DepartementsService
  ) {}

  ngOnInit(): void {
    forkJoin({
      students: this.studentsService.getStudents(),
      courses: this.coursesService.getFormations(),
      departements: this.departementsService.getDepartments()
    }).subscribe(({ students, courses, departements }) => {
      this.students = students;
      this.courses = courses;
      this.departements = departements;

      this.totalStudents = students.length;
      this.totalDepartments = departements.length;
      this.totalCourses = courses.length;

      this.buildBarChart();
      this.buildPieChart();
    });
  }

  buildBarChart() {
    const labels = this.departements.map(dep => dep.name);

    const data = this.departements.map(dep =>
      this.students.filter(s => s.departmentId === dep._id).length
    );
    console.log(data);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Students',
          data: data,
          backgroundColor: '#00aaff'
        }
      ]
    };
  }

  buildPieChart() {
    const labels = this.departements.map(dep => dep.name);


    this.courses.forEach(course => {
      console.log(course);
    });

    const data = this.departements.map(dep =>
      this.courses.reduce((total, course) => {
        return course.departmentIds.includes(dep._id) ? total + course.students.length : total;
      }, 0)
    );

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#ef5350', '#26c6da', '#7e57c2', '#66bb6a',
            '#00aaff', '#0099e6', '#006496', '#005577',
            '#ffaa00', '#ff4081'
            
          ]
        }
      ]
    };
  }
}
