import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import DataTables from 'datatables.net';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-employee-table',
  standalone: false,
  
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent {
adminDetails: any = {};
  employees: any;
  adminEmail: string | null = '';
  employeeIds: string[] = [];
  assignedTask: any;
  taskIds:any;
  dtOptions:any;
  dtTrigger:Subject<any> = new Subject<any>();
  url:String="";

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.url = this.authService.apiUrl;
    this.dtOptions  = {
      pagingType:"full_numbers"
    }

    this.adminEmail = localStorage.getItem('userEmail');
    if (!this.adminEmail) {
      console.error('Admin email not found');
      return;
    }

    this.authService.getAdminDetails(this.adminEmail).subscribe({
      next: (response) => {
        if (response.status) {
          this.adminDetails = response.adminDetails;
          console.log(this.adminDetails);
          this.getemployees();
          
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }

  getemployees(): void {
    this.employeeIds = this.adminDetails[0]?.employees || [];
    if (!this.employeeIds.length) {
      console.warn('No employees found for the admin');
      return;
    }
    console.log("Employee Ids:",this.employeeIds);

    this.http
       .post<{ status: boolean; employees: any[];assignedTask:any }>(`${this.url}/user/employees`, {
        employeeIds: this.employeeIds,
       })
       .subscribe({
         next: (result) => {
           if (result.status) {
             this.employees= result.employees || [];
             this.dtTrigger.next(null);
             console.log("Employees",this.employees);
             this.taskIds =result.assignedTask;
             
           } else {
             console.error('No employees found');
           }
         },
         error: (error) => console.error('Error fetching employees:', error),
       });
  }
  EditEmployee(employee_id:String){
    this.router.navigate(["EditEmployee",employee_id]);
  }
  
  deleteEmployee(employee_id:String){
    const Employee = {
      employee_id:employee_id,
      adminEmail: localStorage.getItem('userEmail') 
    };
  
    console.log("DeleteEmployee",Employee);
  
    this.http
      .delete<{ status: boolean; message: string }>(`${this.url}/user/DeleteEmployee`, {
        body: Employee 
      })
      .subscribe({
        next: (result) => {
          if (result.status) {
            alert("Employee Deleted !")
            console.log("Employee Deleted Successfull");
            window.location.reload();
          } else {
            console.error('No projects found');
          }
        },
        error: (error) => console.error('Error fetching projects:', error),
      });
  }
}

