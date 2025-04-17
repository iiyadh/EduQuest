import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http :HttpClient) { }


  students: any[] = [];

  getStudents() {
    return this.http.get("http://127.0.0.1:8000/admin/allstudents").pipe(
      tap((data: any) => this.students = data)
    );
  }
}
