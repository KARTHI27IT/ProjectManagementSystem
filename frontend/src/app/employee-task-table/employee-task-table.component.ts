import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import DataTables from 'datatables.net';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-employee-task-table',
  standalone: false,
  
  templateUrl: './employee-task-table.component.html',
  styleUrl: './employee-task-table.component.css'
})
export class EmployeeTaskTableComponent {
  employeeEmail: string = ''; 
  employeeDetails: any;
  assignedTasks: any; 
  taskIds: any; 
  tasks: any;
  dtoptions:any;
  url:String="";
  dtTrigger:Subject<any> = new Subject<any>();
  constructor(
    private http: HttpClient,
    private authService:AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.url = this.authService.apiUrl;
    this.dtoptions  = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    // Ensure user is logged in
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to access the dashboard!');
      this.router.navigate(['/login']);
      return;
    }

    // Fetch employee email from localStorage
    this.employeeEmail = localStorage.getItem('userEmail') || '';
    console.log('Employee Email:', this.employeeEmail);

    if (!this.employeeEmail) {
      console.error('Employee email not found');
      return;
    }

    // Fetch employee details
    this.authService.getEmployeeDetails(this.employeeEmail).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.employeeDetails = response.employeeDetails[0];
          console.log('Employee Details:', this.employeeDetails);

          // Extract assigned tasks and task IDs
          this.assignedTasks = this.employeeDetails.assignedTask || [];
          this.taskIds = this.assignedTasks.map((task: any) => task.task_id);
          console.log('Task IDs:', this.taskIds);

          // Fetch task details using task IDs
          this.getTasksDetails();
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear(); // Get the full year
  
    return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
  }
  
  
  // Fetch task details based on task IDs
  getTasksDetails(): void {
    // Send task IDs to the backend to fetch task details
    this.http
      .post<{ status: boolean; tasks: any, message: string }>(
        `${this.url}/user/getTasks`,
        this.taskIds// Send taskIds as an object
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            console.log('Fetched Tasks:', result.tasks);
            this.tasks = result.tasks;
            this.dtTrigger.next(null);
            console.log("Tasks:",this.tasks);
          } else {
            console.error('No tasks found');
          }
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        },
      });
  }

  TaskDetails(task_id:String){
    this.router.navigate(["TaskDetails",task_id]);
  }

  report(task_id:String){
    this.router.navigate(["employeeReport",task_id]);
  }
}
