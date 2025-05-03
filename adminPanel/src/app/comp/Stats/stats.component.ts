import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType, ChartConfiguration } from 'chart.js';
import { StatsService ,ChartData } from '../../services/stats.service';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})


export class StatsComponent implements OnInit {

    constructor(private statsService:StatsService) { }

  deptChartData!:ChartData;
  courseChartData !:ChartData;
  passFailChartData !:ChartData; 


  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  deptChartType: ChartType = 'bar';
  courseChartType: ChartType = 'doughnut';
  passFailChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(){
    this.deptChartData = this.statsService.getDeptChartData();
    this.courseChartData = this.statsService.getCourseChartData();
    this.passFailChartData = this.statsService.getPassFailChartData();
  }
}