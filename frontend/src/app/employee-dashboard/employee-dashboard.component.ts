import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  standalone:false,
  styleUrls: ['./employee-dashboard.component.css'], 
})
export class EmployeeDashboardComponent  { 
  employeeEmail: string = ''; 
  employeeDetails: any;
  assignedTasks: any; 
  taskIds: any; 
  tasks: any;
  taskPercentages:any;
  taskNames :any;
  chart:any;
  constructor(
    private http: HttpClient,
    private authService:AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to access the dashboard!');
      this.router.navigate(['/login']);
      return;
    }

    this.employeeEmail = localStorage.getItem('userEmail') || '';
    console.log('Employee Email:', this.employeeEmail);

    if (!this.employeeEmail) {
      console.error('Employee email not found');
      return;
    }
    this.authService.getEmployeeDetails(this.employeeEmail).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.employeeDetails = response.employeeDetails[0];
          console.log('Employee Details:', this.employeeDetails);

          this.assignedTasks = this.employeeDetails.assignedTask || [];
          this.taskIds = this.assignedTasks.map((task: any) => task.task_id);
          console.log('Task IDs:', this.taskIds);

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

  getTasksDetails(): void {
    this.http
      .post<{ status: boolean; tasks: any, message: string }>(
        'http://localhost:3000/user/getTasks',
        this.taskIds
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            console.log('Fetched Tasks:', result.tasks);
            this.tasks = result.tasks;
            console.log("Tasks:",this.tasks);
            this.processMainTaskData();
            this.initializeMainChart();
            this.initializeRightChart();
          } else {
            console.error('No tasks found');
          }
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        },
      });
  }

  
  processMainTaskData(): void {
    this.taskPercentages = [];
    this.taskNames = [];
  
    for (let task of this.tasks) {
      this.taskNames.push(task.task_name || 'Unnamed Task');
      switch (task.task_status) {
        case 'planned':
          this.taskPercentages.push(0); 
          break;
        case 'started':
          this.taskPercentages.push(20); 
          break;
        case 'pending':
          this.taskPercentages.push(40); 
          break;
        case 'in progress':
          this.taskPercentages.push(60); 
          break;
        case 'under review':
          this.taskPercentages.push(80); 
          break;
        case 'completed':
          this.taskPercentages.push(100); 
          break;
        default:
          this.taskPercentages.push(0); 
          break;
      }
    }
  }
  
  
  initializeMainChart(): void {
    console.log(this.taskPercentages);
    const options = {
      chart: {
        type: 'area',
        height: 400,
      },
      series: [
        {
          name: 'Completion Percentage',
          data: this.taskPercentages,
        },
      ],
      xaxis: {
        categories: this.taskNames,
      },
      yaxis: {
        title: {
          text: 'Completion Percentage (%)',

        },
        min: 0,
        max: 100,
      },

      colors: ['#40d522'],
    };

    this.chart = new ApexCharts(document.querySelector('#chart'), options);
    this.chart.render();
  }
  

  initializeRightChart(): void {
    const TaskStatusCounts = this.calculateTaskStatusCounts();
  
    const TaskStatusData = [
      TaskStatusCounts.planned,
      TaskStatusCounts.started,
      TaskStatusCounts.pending,
      TaskStatusCounts.inProgress,
      TaskStatusCounts.underreview,
      TaskStatusCounts.completed,
    ];
  
    const options = {
      chart: {
        height: 350,
        type: 'donut',
      },
      series: TaskStatusData,
      labels: ['Planned', 'Started', 'Pending', 'In Progress', 'Under Review', 'Completed'],
      colors: ['#ff9800', '#ff5722', '#ffbc00', '#40d522'],
    };
  
    const chart2 = new ApexCharts(document.querySelector('#chart1'), options);
    chart2.render();
  }

  calculateTaskStatusCounts(): { planned: number, started: number, pending: number, inProgress: number, underreview: number, completed: number } {
    const statusCounts = {
      planned: 0,
      started: 0,
      pending: 0,
      inProgress: 0,
      underreview: 0,
      completed: 0,
    };
  
    this.tasks.forEach((task: any) => {
      switch (task.task_status) {
        case 'planned':
          statusCounts.planned++;
          break;
        case 'started':
          statusCounts.started++;
          break;
        case 'pending':
          statusCounts.pending++;
          break;
        case 'in progress':
          statusCounts.inProgress++;
          break;
        case 'under review':
          statusCounts.underreview++;
          break;
        case 'completed':
          statusCounts.completed++;
          break;
        default:
          break;
      }
    });
  
    return statusCounts;
  }
}
