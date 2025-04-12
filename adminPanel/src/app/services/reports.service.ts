import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ReportsService {

  constructor(private http :HttpClient) { }


  getReports() {
    return this.http.get("http://localhost:8000/admin/reports");
  }

  removeReport(id: string) {
    return this.http.delete(`http://localhost:8000/admin/deletereport/${id}`);
  }
}
