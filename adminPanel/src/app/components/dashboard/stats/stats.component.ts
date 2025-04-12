import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentsService } from "../../../services/students.service";
import { CoursesService } from "../../../services/courses.service";
import { DepartementsService } from "../../../services/departements.service";
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { InboxComponent } from "./inbox/inbox.component";

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,InboxComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  totalStudents: number = 0;
  totalDepartments: number = 0;
  totalCourses: number = 0;

  students: any[] = [];
  departements: any[] = [];
  courses: any[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Department' }
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: { display: true, text: 'Students' }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Students per Department',
        backgroundColor: '#4CAF50'
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
      }
    ]
  };

  constructor(
    private studentsService: StudentsService,
    private departementsService: DepartementsService,
    private coursesService: CoursesService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.studentsService.getStudents(),
      this.departementsService.getDepartments(),
      this.coursesService.getFormations()
    ]).subscribe({
      next: ([students, departments, courses]: [any, any[], any[]]): void => {
        this.students = students;
        this.departements = departments;
        this.courses = courses;

        this.totalStudents = students.length;
        this.totalDepartments = departments.length;
        this.totalCourses = courses.length;

        // Get labels and values
        const labels = departments.map(d => d.name);
        const values = departments.map(d => 
          students.filter((s:any) => String(s.departmentId) === String(d._id)).length
        );

        // Update Bar Chart
        this.barChartData = {
          labels,
          datasets: [
            {
              data: values,
              label: 'Students per Department',
              backgroundColor: '#4CAF50'
            }
          ]
        };

        // Update Pie Chart
        this.pieChartData = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
            }
          ]
        };

        // Trigger chart updates
        this.chart?.update();
      }
    });
  }
}
