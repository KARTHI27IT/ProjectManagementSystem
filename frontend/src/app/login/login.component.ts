import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone:false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  phoneno:Number=0;
  employees=[];
  projects=[];
  isEmployee:boolean=true;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    // Basic field validation
    if (!this.email || !this.password) {
        alert('All fields are required!');
        return;
    }

    // Prepare the login payload
    const loginPayload = { 
        email: this.email, 
        password: this.password, 
        isEmployee: this.isEmployee 
    };

    // API call to the login endpoint
    this.http.post<{
        status: boolean; 
        message: string; 
        token?: string; 
        user?: { 
            name: string; 
            email: string; 
            phoneno: number; 
            isEmployee: boolean; 
        }; 
    }>('http://localhost:3000/user/login', loginPayload)
    .subscribe(
        (resultData) => {
            if (resultData.status) {
                  Swal.fire({
                    title: 'Success!',
                    text: resultData.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
                localStorage.setItem('token', resultData.token || '');
                localStorage.setItem('userEmail', resultData.user?.email || '');
                localStorage.setItem('isEmployee', resultData.user?.isEmployee ? 'true' : 'false');

                const dashboardRoute = this.isEmployee ? 'employeeDashboard' : 'dashbord';
                this.router.navigate([dashboardRoute]);
                
            } else {
          Swal.fire({
            title: 'Error!',
            text: resultData.message ,
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
            }
        },
        (error) => {
            console.error('Error during login:', error);
          Swal.fire({
            title: 'Error!',
            text:error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
    );
}

}  
