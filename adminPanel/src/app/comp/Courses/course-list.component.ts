import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Course } from '../../services/courses.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import {CoursesService} from "../../services/courses.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [FormsModule,NzDividerModule,NzTableModule,NzButtonModule,NzIconModule,NzInputModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor(
    private coursesService: CoursesService,
    private router: Router
  ) {}

  searchTerm: string = '';
  courses: Course[] = [];
  filteredCourses: Course[] = [];

  ngOnInit(): void {
    this.coursesService.cleanCourses();
    this.courses = this.coursesService.getAllCourses();
    this.filteredCourses = [...this.courses];
  }

  filterCourses(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      this.filteredCourses = this.courses.filter(course =>
        (course.title?.toLowerCase() ?? '').includes(term) ||
        (course.description?.toLowerCase() ?? '').includes(term)
      );
    } else {
      this.filteredCourses = [...this.courses];
    }
  }

  navigateTo(courseId :any):void{
    this.router.navigateByUrl(`/courses/${courseId}`);
  }

  deleteCourse(courseId: any): void {
    this.coursesService.deleteCourse(courseId);
    this.courses = this.courses.filter(course => course.id !== courseId);
    this.filteredCourses = this.courses;
  }
}