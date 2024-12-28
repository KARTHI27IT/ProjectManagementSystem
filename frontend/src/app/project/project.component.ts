import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  standalone:false,
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  adminDetails: any = {}
  adminEmail: string | null = '';
  private route = inject(ActivatedRoute);
  private authService: AuthService;
  private http: HttpClient;
  private router: Router;
  project:any;
  project_id:String="";
  tasks:any;
  project_start:String="";
  project_end:String="";
 
  constructor(
    authService: AuthService,
    http: HttpClient,
    router: Router
  ) {
    this.authService = authService;
    this.http = http;
    this.router = router;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
  
    return `${day}-${month}-${year}`; 
  }
  



  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.project_id = params["id"];
    });
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.adminEmail = localStorage.getItem('userEmail') || '';
    if (!this.adminEmail) {
      console.error('Admin email not found');
      return;
    }

    this.fetchAdminDetails();
    this.getSingleProject();

  }




  
  


  fetchAdminDetails(): void {
    this.authService.getAdminDetails(this.adminEmail!).subscribe({
      next: (response) => {
        if (response.status) {
          this.adminDetails = response.adminDetails[0];
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }
  tasksIds:any;
  // GET PROJECT DETAILS
  
  getSingleProject(): void {
  const PROJECT_ID={
    project_id:this.project_id
  };
    this.http
      .post<{ status: boolean; project:any }>('http://localhost:3000/user/SingleProject',PROJECT_ID)
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.project = result.project[0];
            this.project_start = this.formatDate(this.project.project_start);
            this.project_end = this.formatDate(this.project.project_end);
            this.tasksIds=this.project.tasks;
            console.log(this.project);
            console.log(this.tasksIds);
            this.getTasksDetails();
          } else {
            console.error('No projects found');
          }
        },
        error: (error) => console.error('Error fetching projects:', error),
      });
  }

  getTasksDetails():void{
    this.http
      .post<{ status: boolean; tasks:any,message:String }>('http://localhost:3000/user/getTasks',this.tasksIds)
      .subscribe({
        next: (result) => {
          if (result.status) {
            console.log(result.tasks);
            this.tasks=result.tasks;
            this.processTaskData();
            this.initializeChart1();
            this.initializeChart();
          } else {
            console.error('No projects found');
          }
        },
        error: (error) => console.error('Error fetching projects:', error),
      });
  }



  CreateTasks(projectId:String,project_start:Date,project_end:Date){
    console.log(this.project.no_of_tasks);
    console.log(this.project.tasks.length);
    if(this.project.no_of_tasks>this.project.tasks.length){ 
      this.router.navigate(['/createTasks', projectId, 'start', project_start, 'end', project_end]);
    }else{
      alert("Update the No of tasks field to add tasks")
    }
  }

  EditTask(task_id:String){
    this.router.navigate(["/editTask",task_id]);    
  }

  DeleteTask(task_id:String){
    const Task = {
      task_id:task_id,
    };
  
  
    this.http
      .delete<{ status: boolean; message: string }>('http://localhost:3000/user/DeleteTask', {
        body: Task
      })
      .subscribe({
        next: (result) => {
          if (result.status) {
            alert(result.message);  
            console.log("Task Deleted Successfull");
            window.location.reload();
          } else {
            console.error('No Task found');
          }
        },
        error: (error) => console.error('Error fetching Task:', error),
      });
  }
  EditProject(projectId: string ):void {
    console.log(projectId);
    this.router.navigate(['EditProject', projectId]);
}
calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check if the dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date format for project_start or project_end");
    return 0; // Return 0 or handle as per your needs
  }

  // Calculate the difference in milliseconds and convert to days
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  return Math.round(diffInDays); // Return the number of days
}


updateStatus(project_id:String){

  if(this.project.project_status === "created"){
    alert("Update status");
  }
  const PROJECT_STATUS={
    project_id:this.project._id,
    project_status:this.project.project_status
  }
  this.http.put<{status:boolean,message:String}>("http://localhost:3000/updateProjectStatus",PROJECT_STATUS)
  .subscribe((resultData)=>{
    if(resultData.status){
      Swal.fire({
        title:"Success",
        text:"Status Updated",
        icon:"success"
      });
    }else{
      Swal.fire({
        title:"Error",
        text:"resultData.message",
        icon:"error"
      })
    }
  })
}


taskPercentages:any;
taskNames:any;

processTaskData(): void {
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



  
chart1:any;
initializeChart1(): void {
    // console.log(this.taskPercentages);
    const options = {
      chart: {
        type: 'bar',
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
    
    const chart = new ApexCharts(
      document.querySelector('#chart'),
      options
    );
    chart.render();
  }

  initializeChart(): void {
    const TaskStatusCounts = this.calculateProjectStatusCounts();
  
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

  calculateProjectStatusCounts(): { planned: number, started: number, pending: number, inProgress: number, underreview: number, completed: number } {
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
  

  //FILE DOWNLOAD

  downloadFile(file:any) {
    console.log("File:",file);
    const filePath = file.filePath;
    const fileName = file.fileName;
    console.log("path:",filePath);
    const url = `http://localhost:3000/download/${filePath}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        const blob = new Blob([response]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(link.href);
      },
      (error) => {
        console.error('Download error:', error);
        alert('Error downloading the file.');
      }
    );
  }
  taskPercentage:number=0;
  initializeTaskChart(task_status: string, index: number) {
    switch (task_status) {
      case 'planned':
        this.taskPercentage = 0;
        break;
      case 'started':
        this.taskPercentage = 20;
        break;
      case 'pending':
        this.taskPercentage = 40;
        break;
      case 'in progress':
        this.taskPercentage = 60;
        break;
      case 'under review':
        this.taskPercentage = 80;
        break;
      case 'completed':
        this.taskPercentage = 100;
        break;
      default:
        break;
    }
  
    const options = {
      chart: {
        type: "radialBar"
      },
      series: [this.taskPercentage],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: "70%"
          },
          dataLabels: {
            showOn: "always",
            name: {
              offsetY: -10,
              show: true,
              color: "#888",
              fontSize: "13px"
            },
            value: {
              color: "#111",
              fontSize: "30px",
              show: true
            }
          }
        }
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
      colors: ["#40d522"]
    };
  
    // Use a unique ID for each chart
    const chartElement = document.querySelector(`#taskChart-${index}`);
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  }
  
  
}
