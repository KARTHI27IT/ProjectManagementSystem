import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-create-employee',
  standalone: false,
  
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent {

  constructor(public http:HttpClient,public router:Router,public authService:AuthService){}
  adminEmail:String="";
  empName:string="";
  empEmail:string="";
  empPassword:string="";
  empConfirmPassword:string="";
  empPhoneno:number=0;
  url:String="";

  registerEmp(){
    debugger;
    this.url = this.authService.apiUrl;
    this.adminEmail = localStorage.getItem('userEmail') || '';
    if (!this.empName || !this.empEmail || !this.empPassword || !this.empConfirmPassword) {
      alert('All fields are required!');
      return;
    }
    if (this.empPassword !== this.empConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userPayload = {
      adminEmail:this.adminEmail,
      empName: this.empName,
      empEmail: this.empEmail,
      empPassword: this.empPassword,
      empPhoneno: this.empPhoneno,
    };
    this.http.post<{message:String}>(
      `${this.url}/user/createEmp`,
      userPayload
    ).subscribe(
      (resultData) => {
        if(resultData){
          Swal.fire({
            title: 'Success!',
            text: "Employee Created",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(["/employeeTable"]);
        }
        
        else{
          Swal.fire({
            title: 'Error!',
            text: 'Failed to create employee',
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
      },
      (error) => {
        console.error('Error:', error); 
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    );
  }
}
