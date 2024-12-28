import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-task',
  standalone: false,
  
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {
  constructor(public router:Router,public http:HttpClient,public authService:AuthService){}
  task_name:String="";
  task_desc:String="";
  task_start:Date=new Date();
  task_end:Date=new Date();
  task_status:String="";
  task_assigned_to:String="";
  task_id:String="";
  task:any;

  adminEmail: string | null = '';
  adminDetails:any;
  employees:any;
  employeeIds:any;

  private route = inject(ActivatedRoute);
  ngOnInit(){
   
    this.route.params.subscribe((params)=>{
      this.task_id = params["id"];
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


    this.getTask();
  }
  getTask(){

    const TASK_ID={
      task_id:this.task_id
    }
    this.http.post<{status:boolean,message:String,task:any}>('http://localhost:3000/user/SingleTask',TASK_ID)
    .subscribe((resultData)=>{
      if(resultData.status){
        this.task=resultData.task[0];
      }else{
        console.log("Failed");
      }
    });
  }
  editTask(){
    const tasksDetails = {
      task_id:this.task_id,
      task_name:this.task.task_name,
      task_desc:this.task.task_desc,
      task_start:this.task.task_start,
      task_end:this.task.task_end ,
      task_status:this.task.task_status,
      task_assigned_to:this.task.task_assigned_to
    };
    this.http.put<{ status: boolean, message: string ,task:any}>(
      'http://localhost:3000/user/EditTask',
      tasksDetails
    ).subscribe(
      (resultData) => {
        if (resultData.status) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: resultData.message,
            });
          console.log("Updated task:",resultData.task);
          this.router.navigate(['project',resultData.task.project_id]); 
        } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Task update failed.',
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
