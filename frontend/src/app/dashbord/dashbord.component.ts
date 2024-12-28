import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  standalone:false,
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  adminName: string = '';
  adminDetails: any;
  adminEmail: string | null = '';
  projectIds: string[] = [];
  employeeIds: string[] = [];
  projects: any[] = [];
  employees: any[] = [];
  tasks: any[] = [];
  tasknumber: number = 0;
  taskIds:any;
  todoProjects: any[] = [];
  inProgressProjects: any[] = [];
  completedProjects: any[] = [];
  url:String="";
  
  taskStats = {
    created: 0,
    inProgress: 0,
    completed: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  

  ngOnInit() {
    this.url = this.authService.apiUrl;
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

  }


  
  


  fetchAdminDetails(): void {
    this.authService.getAdminDetails(this.adminEmail!).subscribe({
      next: (response) => {
        if (response.status) {
          this.adminDetails = response.adminDetails[0];
          this.adminName = this.adminDetails.name;
          this.projectIds = this.adminDetails.projects || [];
          this.employeeIds = this.adminDetails.employees || [];
          // console.log('Admin details:', this.adminDetails);

          this.getProjects();
          this.getEmployees();
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }

  getProjects(): void {
    if (!this.projectIds.length) {
      console.warn('No projects found for the admin');
      return;
    }

    this.http
      .post<{ status: boolean; projects: any[] }>(
        `${this.url}/user/projects`,
        { projectIds: this.projectIds }
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.projects = result.projects || [];
            // console.log('Projects:', this.projects);

            this.fetchTasks();
            // console.log("Tasks:",this.tasks);
            this.calculateTaskNumber();
            this.filterProjects();
            this.initializeChart();
            // this.calculateTaskStats();
            
          } else {
            console.error('No projects found');
          }
        },
        error: (error) => console.error('Error fetching projects:', error),
      });
  }


  fetchTasks(): void {
    const allTaskIds: string[] = [];
  
    this.projects.forEach((project: any) => {
      if (project.tasks && Array.isArray(project.tasks)) {
        allTaskIds.push(...project.tasks);
      }
    });
    // console.log("All Task Ids:",allTaskIds);

    if (allTaskIds.length === 0) {
      console.warn('No tasks found in the projects');
      return;
    }
  
    this.http
      .post<{ status: boolean; tasks: any[]; message: string }>(
        `${this.url}/user/getTasks`,
        allTaskIds
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            console.log('Fetched tasks:', result.tasks);
            this.tasks = result.tasks; 
            this.processTaskData();
            this.initializeChart1();
            
          } else {
            console.error('No tasks found:', result.message);
          }
        },
        error: (error) => console.error('Error fetching tasks:', error),
      });
  }

  calculateTaskNumber(): void {
    this.tasknumber = this.projects.reduce(
      (total, project) => total + (project.tasks?.length || 0),
      0
    );
    console.log('Total number of tasks:', this.tasknumber);
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
        document.querySelector('#chart1'),
        options
      );
      chart.render();
    }
  getEmployees(): void {
    if (!this.employeeIds.length) {
      console.warn('No employees found for the admin');
      return;
    }

    this.http
      .post<{ status: boolean; employees: any[] }>(
        `${this.url}/user/employees`,
        { employeeIds: this.employeeIds }
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.employees = result.employees || [];
            console.log('Employees:', this.employees);
          } else {
            console.error('No employees found');
          }
        },
        error: (error) => console.error('Error fetching employees:', error),
      });
  }



  filterProjects(): void {
    this.todoProjects = this.projects.filter(
      (project) => project.project_status === 'created'
    );
    this.inProgressProjects = this.projects.filter(
      (project) => project.project_status === 'pending' || project.project_status === 'in progress'
    );
    this.completedProjects = this.projects.filter(
      (project) => project.project_status === 'completed'
    );
  }
  



  navigateToProject(projectId: string): void {
    this.router.navigate(['project', projectId]);
  }

  initializeChart(): void {
    const ProjectStatusCounts = this.calculateProjectStatusCounts();
  
    const ProjectStatusData = [
      ProjectStatusCounts.created,   
      ProjectStatusCounts.pending,   
      ProjectStatusCounts.inProgress, 
      ProjectStatusCounts.completed, 
    ];
  
    // Configure the chart options
    const options = {
      chart: {
        height: 350,
        type: 'donut',
      },
      series: ProjectStatusData,  
      labels: ['Created', 'Pending', 'In Progress', 'Completed'],  
      colors: ['#ff9800', '#ff5722', '#ffbc00', '#40d522'], 
    };
  

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }

  calculateProjectStatusCounts(): { created: number, pending: number, inProgress: number, completed: number } {
    const statusCounts = {
      created: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };
  
    this.projects.forEach((project: any) => {
      switch (project.project_status) {
        case 'created':
          statusCounts.created++;
          break;
        case 'pending':
          statusCounts.pending++;
          break;
        case 'in progress':
          statusCounts.inProgress++;
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


  // calculateTaskStats(): void {
  //   // Reset task stats
  //   this.taskStats = { created: 0, inProgress: 0, completed: 0 };

  //   // Calculate task statuses from projects
  //   this.projects.forEach((project) => {
  //     if (project.tasks) {
  //       project.tasks.forEach((task: { task_status: string }) => {
  //         if (task.task_status === 'created') this.taskStats.created++;
  //         else if (task.task_status === 'pending') this.taskStats.inProgress++;
  //         else if (task.task_status === 'completed') this.taskStats.completed++;
  //       });
  //     }
  //   });

  //   console.log('Task stats:', this.taskStats);
  // }


