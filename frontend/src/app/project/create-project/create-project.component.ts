import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-create-project',
  standalone: false,
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  adminEmail: string = '';
  project_name: string = "";
  project_desc: string = "";
  project_start: Date = new Date();
  project_end: Date = new Date();
  no_of_tasks: number = 0;
  project_id:String='';
  project_status:String="created";
  
  
  constructor(
    public http: HttpClient,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to access the dashboard!');
      this.router.navigate(['/login']);
    } else {
      this.adminEmail = localStorage.getItem('userEmail') || '';
    }
  }


  createProject() {
    if (!this.project_name || !this.project_desc || !this.project_start || !this.project_end) {
      alert('All fields for the project are required!');
      return;
    }
  
    const projectDetails = {
      adminEmail: this.adminEmail,
      project_name: this.project_name,
      project_desc: this.project_desc,
      project_start: this.project_start,
      project_end: this.project_end,
      no_of_tasks: this.no_of_tasks,
      project_status:this.project_status
    };

    this.http.post<{ status: boolean, message: string ,project_id:String}>(
      'http://localhost:3000/user/createProject',
      projectDetails
    ).subscribe(
      (resultData) => {
        if (resultData.status) {
          Swal.fire({
            title: 'Success!',
            text: "Project Created",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.project_id=resultData.project_id;
          this.router.navigate(['/projectTable']); 
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
          text: error,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    );
  }
  
}
