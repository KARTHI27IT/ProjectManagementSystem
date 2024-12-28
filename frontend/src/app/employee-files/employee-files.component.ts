import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { error } from 'jquery';

@Component({
  selector: 'app-employee-files',
  standalone: false,
  templateUrl: './employee-files.component.html',
  styleUrls: ['./employee-files.component.css']
})
export class EmployeeFilesComponent implements OnInit {
  employeeEmail: string = '';
  adminEmail:string="";
  files: any[] = [];
  adminDetails:any;
  isEmployee:boolean=false;
  url:String="";
  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    
    this.url = this.authService.apiUrl;
    const isEmployee = localStorage.getItem('isEmployee') || '';
    if (isEmployee === 'true') {
      this.isEmployee = true;
      this.employeeEmail = localStorage.getItem('userEmail') || '';
      this.getEmployeeFiles();
    } else {
      this.isEmployee = false;
      this.adminEmail = localStorage.getItem('userEmail') || '';
      this.authService.getAdminDetails(this.adminEmail).subscribe(
        (resultData: { adminDetails: any[] }) => {
          if (resultData && resultData.adminDetails && resultData.adminDetails.length > 0) {
            this.adminDetails = resultData.adminDetails[0];
            this.getAdminFiles();
          }
        },
        (error: any) => {
          console.error('Error fetching admin details:', error);
        }
      );
    }
  }
  
  
  getAdminFiles(){
    const employeeIds = this.adminDetails.employees;
    console.log("Employee:",employeeIds);
    this.http.post<{ status: boolean, message: string, files: any }>(`${this.url}/admin/getAllFiles`, employeeIds)
    .subscribe(
      (resultData) => {
      if (resultData.status) {
        console.log(resultData.message);
        console.log(resultData.files);
        if(resultData.files.length > 0){
          for(let files of resultData.files){
            if(files.length>0){
              for(let file of files){
                this.files.push(file);
              }
            }
          }
        }
        console.log("Files retrieved:", this.files);
      }
    }
  );
  }

  getEmployeeFiles() {
    const employeeDetails = {
      empEmail: this.employeeEmail
    };

    this.http.post<{ status: boolean, message: string, files: any }>(`${this.url}/employee/getAllFiles`, employeeDetails)
      .subscribe((resultData) => {
        if (resultData.status) {
          console.log(resultData.message);
          this.files = resultData.files;
          console.log("Files retrieved:", this.files);
        }
      });
  }

  downloadFile(filePath: string, fileName: string) {
    const url = `${this.url}/download/${filePath}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        // Create a link element to trigger the download
        const blob = new Blob([response]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(link.href);
      },
      (error) => {
        console.error('Download error:', error);
        alert('Error downloading the file.');
      }
    );
  }
  deleteFile(file:any) {
    const fileDetails={
      fileName:file.fileName,
      filePath:file.filePath,
      uploadedBy:file.uploadedBy,
      task_id:file.task_id
    }
    console.log("file:",fileDetails);
    const url = `${this.url}/employee/deleteFile`;
  
    this.http.post<{ status: boolean, message: string }>(url, fileDetails).subscribe(
      (response) => {
        if (response.status) {
          alert('File deleted successfully!');
          window.location.reload();
        } else {
          alert('Error deleting file: ' + response.message);
        }
      },
      (error) => {
        console.error('Delete error:', error);
        alert('An error occurred while deleting the file.');
      }
    );
  }
  
  getFileUrl(filePath: string): string {
    return `${this.url}/${filePath}`;
  }
}
