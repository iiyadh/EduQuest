import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementsService {

  constructor(private http : HttpClient) { }


  departements: any[] = [];

  getDepartments() {
      return this.http.get("http://127.0.0.1:8000/admin/alldepartement").pipe(
        tap((data: any) => this.departements = data)
      );
  }

  addDepartment(department: any) {
    return this.http.post("http://127.0.0.1:8000/admin/adddepartment", department).pipe(
      tap(() => this.departements.push(department))
    );
  }

  updateDepartment(department: any) {
    return this.http.put(`http://127.0.0.1:8000/admin/updatedepartment/${department._id}`, department).pipe(
      tap(() => {
        const index = this.departements.findIndex(dep => dep._id === department._id);
        if (index !== -1) {
          this.departements[index] = department;
        }
      })
    );
  }

  deleteDepartment(id: string) {
    return this.http.delete(`http://127.0.0.1:8000/admin/deletedepartment/${id}`).pipe(
      tap(() => {
        this.departements = this.departements.filter(dep => dep._id !== id);
      })
    );
  }
}
