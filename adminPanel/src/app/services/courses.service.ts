import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CoursesService {

  constructor(private http : HttpClient) { }

  formations:any[] = []


  addFormation(formation: any) {
    if (!formation) {
      throw new Error('Formation data is required');
    }
    return this.http.post("http://127.0.0.1:8000/admin/addformation", formation).pipe(
      tap((newFormation: any) => this.formations.push(newFormation.formation))
    );
  }

  updateFormation(formation: any) {
    if (!formation || !formation.id) {
      throw new Error('Valid formation data with an ID is required');
    }
    return this.http.put(`http://127.0.0.1:8000/admin/updateformation/${formation.id}`, formation).pipe(
      tap(() => {
        const index = this.formations.findIndex(f => f.id === formation.id);
        if (index !== -1) {
          this.formations[index] = formation;
        }
      })
    );
  }

  deleteFormation(formationId: string) {
    if (!formationId) {
      throw new Error('Formation ID is required');
    }
    return this.http.delete(`http://127.0.0.1:8000/admin/deleteformation/${formationId}`).pipe(
      tap(() => {
        this.formations = this.formations.filter(f => f.id !== formationId);
      })
    );
  }

  getFormations() {
    if (this.formations.length === 0) {
      return this.http.get<any[]>("http://127.0.0.1:8000/admin/formations").pipe(
        tap((data) => this.formations = data)
      );
    }
    return of(this.formations);
  }

}
