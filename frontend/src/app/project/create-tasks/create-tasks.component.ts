import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-create-tasks',
  standalone: false,
  
  templateUrl: './create-tasks.component.html',
  styleUrl: './create-tasks.component.css'
})
export class CreateTasksComponent implements OnInit {
  constructor(public router:Router,public http:HttpClient,public authService:AuthService){}
  task_name:String="";
  task_desc:String="";
  task_start:Date=new Date();
  task_end:Date=new Date();
  task_status:String="planned";
  task_assigned_to:String="";
  project_id:String="";
  private route = inject(ActivatedRoute);
  employees:any;
  employeeIds:any;
  adminEmail: string | null = '';
  adminDetails:any;
  empName:string="";
  project_start:Date=new Date();
  project_end:Date=new Date();

  ngOnInit(): void {
    //project id
    this.route.params.subscribe((params)=>{
      this.project_id = params["id"];
      this.project_start = params["start"];
      this.project_end = params["end"];
    });

    //ADMIN DETAILS
    this.adminEmail = localStorage.getItem('userEmail');
    if (!this.adminEmail) {
      console.error('Admin email not found');
      return;
    }
   
    this.authService.getAdminDetails(this.adminEmail).subscribe({
      next: (response) => {
        if (response.status) {

          
          this.adminDetails = response.adminDetails;
          console.log("Admin Details:",this.adminDetails);

          //Retrieving Employee Details

          this.employeeIds = this.adminDetails[0]?.employees || [];
          if (!this.employeeIds.length) {
          console.warn('No employees found for the admin');
          return;
          }
          console.log("Employee Ids:",this.employeeIds);

          this.http
          .post<{ status: boolean; employees: any[] }>('http://localhost:3000/user/employees', {
          employeeIds: this.employeeIds,
          })
        .subscribe({
         next: (result) => {
           if (result.status) {
             this.employees= result.employees || [];
             console.log("Employees",this.employees);
           } else {
             console.error('No employees found');
           }
         },
         error: (error) => console.error('Error fetching employees:', error),
        });
        } 
        
        else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    })

  }

  createTasks() {
    
    if(!this.task_name || !this.task_desc || !this.task_start || !this.task_end || !this.task_assigned_to){
      alert("All fields are required");
    }

    if (this.task_start < this.project_start || this.task_end > this.project_end) {
      alert("Task must start and end within the project period");
      return; 
    }

    //Task Addition
    const tasksDetails = {
      project_id:this.project_id,
      task_name:this.task_name,
      task_desc:this.task_desc,
      task_start:this.task_start,
      task_end:this.task_end ,
      task_status:this.task_status,
      task_assigned_to:this.task_assigned_to
    };
    this.http
      .post<{ status: boolean; message: string }>(
        'http://localhost:3000/user/createTasks',
        tasksDetails
      )
      .subscribe(
        (resultData) => {
          if (resultData.status) {
          Swal.fire({
            title: 'Success!',
            text: resultData.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
            this.router.navigate(["/project", this.project_id]);
          } else {
          Swal.fire({
            title: 'Error!',
            text: resultData.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
          }
        },
        (error) => {
          console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        }
      );
  }
}
