import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import DataTables from 'datatables.net';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  standalone:false,
  styleUrls: ['./project-table.component.css'],
})
export class ProjectTableComponent {
  adminDetails: any = {};
  projects: any[] = [];
  adminEmail: string | null = '';
  projectIds: string[] = [];
  dtoptions:any;
  dtTrigger:Subject<any> = new Subject<any>();
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}
url:String="";
  ngOnInit(): void {
    this.dtoptions  = {
      pagingType:"full_numbers",
      pageLength:5
    }
    this.url = this.authService.apiUrl;

    this.adminEmail = localStorage.getItem('userEmail');
    if (!this.adminEmail) {
      console.error('Admin email not found');
      return;
    }

    this.authService.getAdminDetails(this.adminEmail).subscribe({
      next: (response) => {
        if (response.status) {
          this.adminDetails = response.adminDetails;
          this.getprojects();
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }



  getprojects(): void {
    this.projectIds = this.adminDetails[0]?.projects || [];
    if (!this.projectIds.length) {
      console.warn('No projects found for the admin');
      return;
    }

    this.http
      .post<{ status: boolean; projects: any[] }>(`${this.url}/user/projects`, {
        projectIds: this.projectIds,
      })
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.projects = result.projects || [];
            this.dtTrigger.next(null);
          } else {
            console.error('No projects found');
          }
        },
        error: (error) => console.error('Error fetching projects:', error),
      });
  }

  viewProject(projectId: string): void {
    console.log(projectId);
    this.router.navigate(['project', projectId]);
  }

  EditProject(projectId: string ):void {
    console.log(projectId);
    this.router.navigate(['EditProject', projectId]);
}

DeleteProject(projectId: string): void {
  const Project = {
    project_id: projectId,
    adminEmail: localStorage.getItem('userEmail') 
  };

  console.log("DeleteProject",Project);

  this.http
    .delete<{ status: boolean; message: string }>(`${this.url}/user/DeleteProject`, {
      body: Project  
    })
    .subscribe({
      next: (result) => {
        if (result.status) {
          alert("Project deleted");
          window.location.reload();
          
        } else {
          console.error('No projects found');
        }
      },
      error: (error) => console.error('Error fetching projects:', error),
    });
}
formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear(); // Get the full year

  return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
}


}
