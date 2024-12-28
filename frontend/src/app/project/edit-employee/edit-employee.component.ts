import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  standalone: false,
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  empName: string = '';
  empEmail: string = '';
  empPassword: string = '';
  empPhoneno: number = 0;
  employee_id: string = '';
  
  private route = inject(ActivatedRoute); 
  constructor(public http: HttpClient, public router: Router,public authService:AuthService) {} 

  employee: any;
url:String="";
  ngOnInit() {
    this.url = this.authService.apiUrl;
    this.route.params.subscribe((params) => {
      this.employee_id = params['id'];
    });
    this.getEmployee();
  }

  getEmployee() {
    const EMPLOYEE_ID = {
      employee_id: this.employee_id,
    };

    this.http
      .post<{ status: boolean; employee: any }>(
        `${this.url}/user/SingleEmployee`,
        EMPLOYEE_ID
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.employee = result.employee[0]; 
            console.log(this.employee);
          } else {
            console.error('No employee found');
          }
        },
        error: (error) => console.error('Error fetching employee:', error),
      });
  }

  EditEmployee() {
    const EmployeeDetails = {
      employee_id: this.employee_id,
      empName: this.employee.empName,
      empEmail: this.employee.empEmail,
      empPhoneno: this.employee.empPhoneno,
      empPassword: this.employee.empPassword
    };
    console.log("Updating employee Details:", EmployeeDetails);

    this.http.put<{ status: boolean, message: string, employee: any }>(
      `${this.url}/user/EditEmployee`,
      EmployeeDetails
    ).subscribe(
      (resultData) => {
        if (resultData.status) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Employee updated successfully!',
          });
          console.log("Updated employee:", resultData.employee);
          this.router.navigate(["employeeTable"]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Employee update failed!',
          });
        }
      },
      (error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error occurred: ${error.message}`,
        });
      }
    );
  }
}
