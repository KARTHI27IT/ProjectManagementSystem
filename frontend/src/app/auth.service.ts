import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient,public router:Router) {}
  adminEmail:String="";
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const isEmployee = localStorage.getItem("isEmployee");
    let userEmail;
    if(!isEmployee){
      userEmail=localStorage.getItem('userEmail');
    }else{
      userEmail = localStorage.getItem('userEmail');
    }
    return !!token; 
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhoneNo');
    this.router.navigate(["login"]);
  }


  getAdminDetails(adminEmail: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/details?email=${adminEmail}`);
  }

  getEmployeeDetails(employeeEmail:String):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/employee/details?email=${employeeEmail}`);
  }

}
