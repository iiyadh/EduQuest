import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { DepartementsService } from '../../../services/departements.service';


// interface Department {
//   id?: string;
//   name: string;
//   description: string;
//   isEditing?: boolean;
//   originalData?: Partial<Department>;
// }

@Component({
  selector: 'app-departements',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './departements.component.html',
  styleUrl: './departements.component.scss'
})
export class DepartementsComponent implements OnInit {

  constructor(private departementsService :DepartementsService) { }
  displayedColumns: string[] = ['name', 'description','theme', 'actions'];
  dataSource:any[] = [
    // {
    //   id: '1',
    //   name: 'Informatique',
    //   description: 'asdf alsdkfja lskdjf oiuvcxoiucvo ixucvoi uxcoviuxociuvox iucvoxiucvo …'
    // },
    // {
    //   id: '2',
    //   name: 'Mathematics',
    //   description: 'Department focused on mathematical sciences'
    // }
  ];
  
  newDepartment: any = {
    name: '',
    description: '',
    theme:''
  };

  private loadData(){
    this.departementsService.getDepartments().subscribe(data =>{
      this.dataSource = data;
    })
  }

  ngOnInit() {
    this.loadData();
  }

  startEdit(department: any) {
    department.isEditing = true;
    department.originalData = { ...department };
  }

  cancelEdit(department: any) {
    if (department.originalData) {
      Object.assign(department, department.originalData);
    }
    department.isEditing = false;
    delete department.originalData;
  }

  saveEdit(department: any) {
    department.isEditing = false;
    this.departementsService.updateDepartment({_id :department._id ,name: department.name, description: department.description, theme:department.theme}).subscribe(data => this.loadData);
    delete department.originalData;
  }

  addDepartment() {
    this.departementsService.addDepartment(this.newDepartment).subscribe(()=>
    {
      this.loadData();
      console.log(this.dataSource);
    }
    )
    this.dataSource = [...this.dataSource, this.newDepartment]
    this.startEdit(this.newDepartment);
    this.newDepartment = {
      name: '',
      description: '',
      theme:''
    };
  }

  deleteDepartment(department: any) {
    this.dataSource = this.dataSource.filter(d => d._id !== department._id);
    this.departementsService.deleteDepartment(department._id).subscribe(()=>
    {
      this.loadData();
    }
    )
  }
}
