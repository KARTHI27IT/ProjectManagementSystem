import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-project',
  standalone: false,
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'] // Fixed typo: changed "styleUrl" to "styleUrls"
})
export class EditProjectComponent implements OnInit {
  adminEmail: string = '';
  project_name: string = '';
  project_desc: string = '';
  project_start: Date = new Date();
  project_end: Date = new Date();
  no_of_tasks: number = 0;
  project_id: String = '';
  project_status: String = '';
  project: any;
url:String="";
  private route = inject(ActivatedRoute);

  constructor(
    public http: HttpClient,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.url = this.authService.apiUrl;
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
    });
    this.getProject();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }

  getProject(): void {
    const PROJECT_ID = {
      project_id: this.project_id,
    };
    this.http
      .post<{ status: boolean; project: any }>(
        `${this.url}/user/SingleProject`,
        PROJECT_ID
      )
      .subscribe({
        next: (result) => {
          if (result.status) {
            this.project = result.project[0];
            this.project.project_start = this.formatDate(
              this.project.project_start
            );
            console.log(this.project);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Not Found',
              text: 'No projects found.',
            });
          }
        },
        error: (error) =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error fetching projects: ${error.message}`,
          }),
      });
  }

  EditProject() {
    const projectDetails = {
      project_id: this.project_id,
      project_name: this.project.project_name,
      project_desc: this.project.project_desc,
      project_start: this.project.project_start,
      project_end: this.project.project_end,
      no_of_tasks: this.project.no_of_tasks,
      project_status: this.project.project_status,
    };

    console.log('Updating Project Details:', projectDetails);

    this.http
      .put<{ status: boolean; message: string; project: any }>(
        `${this.url}/user/EditProject`,
        projectDetails
      )
      .subscribe(
        (resultData) => {
          if (resultData.status) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: resultData.message,
            });
            console.log('Updated project:', resultData.project);
            this.router.navigate(['/project', this.project_id]);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Project update failed.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `An error occurred: ${error.message}`,
          });
        }
      );
  }
}
