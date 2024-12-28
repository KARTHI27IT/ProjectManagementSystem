import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from "sweetalert2"
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  standalone:false,
  styleUrls: ['./task-details.component.css'] 
})
export class TaskDetailsComponent {
  task_id: string = '';
  task: any;
  remainingDays: number = 0;
  employeeDetails:any;
  employeeEmail: string | null = '';
  private route = inject(ActivatedRoute);
task_start:string="";
task_end:string="";
task_status:String="";
attachments: File | null = null

  constructor(public http: HttpClient,public authService:AuthService,public router:Router) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachments = input.files[0]; // Get the first file
      console.log('Selected file:', this.attachments.name); // Log file name
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.task_id = params['id'];
    });
    
    this.getTask();
    this.employeeEmail= localStorage.getItem('userEmail');
    if (!this.employeeEmail) {
      console.error('Admin email not found');
      return;
    }
    
    this.authService.getEmployeeDetails(this.employeeEmail).subscribe({
      next: (response) => {
        if (response.status) {
          this.employeeDetails = response.employeeDetails[0];
          console.log(this.employeeDetails);
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }
  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    // Check if the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid date format for project_start or project_end");
      return 0; 
    }

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  
    return Math.round(diffInDays); 
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
  
    return `${day}-${month}-${year}`; 
  }

  calculateRemainingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); 
  }

  getTask() {
    const TASK_ID = {
      task_id: this.task_id,
    };
    this.http
      .post<{ status: boolean; message: string; task: any }>(
        'http://localhost:3000/user/SingleTask',
        TASK_ID
      )
      .subscribe(
        (resultData) => {
          if (resultData.status) {
            this.task = resultData.task[0];
            this.remainingDays = this.calculateRemainingDays(
              this.task.task_start,
              this.task.task_end,
            );
            this.task_start =this.formatDate(this.task.task_start);
            this.task_end = this.formatDate(this.task.task_end);
            this.processTaskData();
            this.initializeChart1();
          } else {
            console.error('Failed to fetch task details.');
          }
        },
        (error) => {
          console.error('Error fetching task details:', error);
        }
      );
  }
  // updateStatus(task_id:String){
  //   const TASK_STATUS={
  //     task_id:task_id,
  //     task_status:this.task.task_status,
  //     attachments:this.attachments
  //   }
  //   this.http.put<{status:boolean,message:String}>
  //   ("http://localhost:3000/employee/updateStatus",TASK_STATUS)
  //   .subscribe((resultData)=>{
  //     if(resultData.status){
  //         Swal.fire({
  //           title: 'Success!',
  //           text: "Status Updated",
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         });

  //       if(this.task.task_status="completed"){
  //         this.router.navigate(["employeeReport",task_id]);
  //       }
       
  //     }
  //   })
  //   }
  
  updateStatus(task_id: string): void {
    const formData = new FormData();
    formData.append('task_id', task_id);
    formData.append('task_status', this.task.task_status);
    formData.append("employeeEmail",this.employeeDetails.empEmail);
    formData.append("adminEmail",this.employeeDetails.Admin);
    if (this.attachments) {
      formData.append('attachments', this.attachments);
      formData.append("fileUploaded", "true");
    }
  
    this.http
      .put<{ status: boolean; message: string }>(
        'http://localhost:3000/employee/updateStatus',
        formData
      )
      .subscribe((resultData) => {
        if (resultData.status) {
          Swal.fire({
            title: 'Success!',
            text: 'Status Updated',
            icon: 'success',
            confirmButtonText: 'OK',
          });


          if (this.task.task_status === 'completed') {
            this.router.navigate(['employeeReport', task_id]);
          }else{
            window.location.reload();
          }
        }
      });
  }


    report(task_id:String){
      this.router.navigate(["employeeReport",task_id]);
    }

task_percentage:number =0;

processTaskData(): void {

    switch (this.task.task_status) {
      case 'planned':
        this.task_percentage = 0; 
        break;
      case 'started':
        this.task_percentage = 20; 
        break;
      case 'pending':
        this.task_percentage = 40; 
        break;
      case 'in progress':
        this.task_percentage = 60; 
        break;
      case 'under review':
        this.task_percentage = 80; 
        break;
      case 'completed':
        this.task_percentage = 100; 
        break;
      default:
        this.task_percentage =0 ; 
        break;
    
  }
}
initializeChart1(): void {
  // const options = {
  //   chart: {
  //     type: 'donut',
  //     height: 350,
  //   },
  //   series: [
  //     {
  //       name: 'Completion Percentage',
  //       data: [this.task_percentage],
  //     },
  //   ],
  //   xaxis: {
  //     categories: [this.task.task_name],
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Completion Percentage (%)',
  //     },
  //     min: 0,
  //     max: 100,
  //   },
  //   colors: ['#40d522'],
  // };
  
  // const chart = new ApexCharts(
  //   document.querySelector('#chart'),
  //   options
  // );
  // chart.render();

  var options = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    series: [this.task_percentage],
    labels: ['Progress'],
    colors: ['#40d522'],
  }
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();
}


}
  

