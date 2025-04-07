import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  login(user : string, password : string){
    return this.http.post("http://127.0.0.1:8000/admin/authentication",
      {
        user: user,
        password: password
      },
      { withCredentials: true });
  }
  logout(){
    return this.http.post("http://127.0.0.1:8000/admin/logout",{ withCredentials: true });
  }
  isLoggedIn(token: string){
    return this.http.get("http://127.0.0.1:8000/admin/check", { params: { token }, withCredentials: true });
  }
}