import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Student } from '../../../services/departements.service';
import { ActivatedRoute } from '@angular/router';
import { DepartmentsService } from "../../../services/departements.service";

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzTagModule,
        NzIconModule,
        NzModalModule,
        NzInputModule,
        NzSwitchModule
    ],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StudentListComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private departmentsService : DepartmentsService

    ){
        
    }

    students: Student[] = [];
    searchText = '';

    ngOnInit(): void {
        const dep = this.departmentsService.getDepartementById(this.route.snapshot.paramMap.get('id') as string);
        if (dep){
            this.students = dep.students;
        }
    }

    get filteredStudents() {
        return this.students.filter(student => 
            student.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
            student.email.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    toggleBlock(student: Student): void {
        student.isBlocked = !student.isBlocked;
    }

    deleteStudent(id: string): void {
        this.students = this.students.filter(student => student.id !== id);
    }
}