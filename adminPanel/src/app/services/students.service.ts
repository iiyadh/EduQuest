import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http :HttpClient) { }

  getStudents(){
    return this.http.get('http://127.0.0.1:8000/admin/allstudents');
  }
}
