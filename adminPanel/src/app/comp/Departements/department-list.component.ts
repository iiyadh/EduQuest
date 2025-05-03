import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DepartmentsService, Department } from '../../services/departements.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzBadgeModule,
    NzTagModule,
    NzModalModule,
    NzListModule,
    NzAvatarModule,
    NzSwitchModule
  ],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  searchTerm = '';
  depId = '';
  isLoading = true;
  dep !:Department;
  originalDep!: Department;

  departments: Department[] = [];
  filteredDepartments: Department[] = [];

  constructor(
    private departmentsService: DepartmentsService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  addDepartement():void{
    const genId = Math.floor(Math.random() * 1000).toString()
    const departement = {
        id: genId,
        name: "Untitled Department",
        description: "Some Description",
        students: []
    }
    this.departmentsService.addDepartement(departement as Department)
    this.loadDepartments();
    this.tooggleEdit(genId);
  }

  tooggleEdit(depId: string): void {
    this.depId = depId;
    const department = this.departmentsService.getDepartementById(depId);
    if (department) {
      this.dep = {
        ...department,
        students: [...department.students]
      };
      this.originalDep = {
        ...department,
        students: [...department.students]
      };
    }
  }
  
  toogleCancel(): void {
    if(this.dep.name === "Untitled Department"){
      console.log(this.dep.name);
      this.departmentsService.deleteDepartment(this.dep.id);
      this.loadDepartments();
    }
    this.dep = { id: '', name: '', description: '', students: [] };
    this.depId = '';
  }

  saveChanges(): void {
    this.departmentsService.updateDepartement(this.depId, this.dep);
    if(this.dep.name === "Untitled Department"){
      this.departmentsService.deleteDepartment(this.dep.id);
    }
    this.depId = '';
    this.dep = { id: '', name: '', description: '', students: [] };
    this.loadDepartments();
  }
  


  loadDepartments(): void {
    this.isLoading = true;
    this.departments = this.departmentsService.getAllDepartements();
    this.filteredDepartments = [...this.departments];
    this.isLoading = false;
  }

  filterDepartments(): void {
    if (!this.searchTerm) {
      this.filteredDepartments = [...this.departments];
    } else {
      this.filteredDepartments = this.departments.filter(dept =>
        dept.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  navigateTo(id: string): void {
    this.router.navigateByUrl(`/department/students/${id}`);
  }

  deleteDepartment(id: string): void {
      this.departmentsService.deleteDepartment(id);
      this.loadDepartments();
  }
}