import { Injectable } from '@angular/core';

export interface ChartData {
    labels: string[];
    datasets: {
        label?: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
}

interface Stat{
    lables:string[];
    data:number[];
}

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    constructor() {}

    deptData :Stat = {
        lables: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
        data: [120, 85, 92, 65],
    };
    courseData :Stat = {
        lables: ['Programming 101', 'Data Structures', 'Calculus', 'Marketing', 'Anatomy'],
        data: [75, 60, 45, 55, 40],
    };

    passFailData :Stat = {
        lables: ['Completed', 'Incomplete'],
        data: [85, 15],
    };

    getDeptChartData(): ChartData {
        return {
            labels: this.deptData.lables,
            datasets: [
                {
                    label: 'Students',
                    data: this.deptData.data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }

    getCourseChartData(): ChartData {
        return {
            labels: this.courseData.lables,
            datasets: [
                {
                    data: this.courseData.data,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(201, 203, 207, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }

    getPassFailChartData(): ChartData {
        return {
            labels: this.passFailData.lables,
            datasets: [
                {
                    data: this.passFailData.data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }
}