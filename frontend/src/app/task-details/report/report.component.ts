import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
interface ReportDetails {
  project_id: string;
  task_name: string;
  report_type: string;
  report_desc: string;
  empName: string;
  empEmail: string;
  task_status: string;
  attachments: any;
}

@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  form: ReportDetails = {
    project_id: '',
    task_name: '',
    report_type: '',
    report_desc: '',
    empName: '',
    empEmail: '',
    task_status: '',
    attachments: null
  };
  
  task_id: string = '';
  task: any;
  employeeDetails: any;
  employeeEmail: string | null = '';
  private route = inject(ActivatedRoute);

  constructor(public http: HttpClient, public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.task_id = params['id'];
    });

    this.getTask();
    this.employeeEmail = localStorage.getItem('userEmail');
    
    if (!this.employeeEmail) {
      console.error('Admin email not found');
      return;
    }

    this.authService.getEmployeeDetails(this.employeeEmail).subscribe({
      next: (response) => {
        if (response.status) {
          this.employeeDetails = response.employeeDetails[0];
          console.log(this.employeeDetails);
          this.form.empName = this.employeeDetails.empName;
          this.form.empEmail = this.employeeDetails.empEmail;
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => console.error('Error fetching admin details:', error),
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }

  sendFile(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.form.attachments = fileList[0]; 
    }
  }
  getTask() {
    const TASK_ID = {
      task_id: this.task_id,
    };

    this.http.post<{ status: boolean; message: string; task: any }>(
      'http://localhost:3000/user/SingleTask',
      TASK_ID
    ).subscribe(
      (resultData) => {
        if (resultData.status) {
          this.task = resultData.task[0];
          console.log("Task:",this.task);
          this.form.project_id = this.task.project_id;
          this.form.task_name = this.task.task_name;
          this.form.task_status = this.task.task_status;
          console.log("Form", this.form);
        } else {
          console.error('Failed to fetch task details.');
        }
      },
      (error) => {
        console.error('Error fetching task details:', error);
      }
    );
  }

  SendEmail() {
    this.http.post<{ status: boolean; message: string }>(
      "http://localhost:3000/user/sendEmail",
      this.form
    ).subscribe(
      (resultData) => {
        if (resultData.status) {
          Swal.fire({
            title: 'Success!',
            text: resultData.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: resultData.message || 'Failed to send email.',
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
      },
      (error) => {
        console.error('Error sending email:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred while sending the email.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  
}













// app.post("/user/sendEmail", async (req, res) => {
//   const TOKEN = "efe19273f8f97fd2c9c612e3f7f19b37";

//   const {
//     project_id,
//     task_name,
//     report_type,
//     report_desc,
//     empName,
//     empEmail,
//     task_status,
//     attachments
//   } = req.body;

//   // Validation for required fields
//   if (!project_id || !task_name || !report_type || !report_desc || !empName || !empEmail || !task_status) {
//     return res.status(400).json({ status: false, message: "All fields are required." });
//   }

//   // Nodemailer Transport Configuration
//   const transport = Nodemailer.createTransport(
//     MailtrapTransport({
//       token: TOKEN,
//       testInboxId: 3341042,
//     })
//   );

//   // HTML Content for the Email
//   const emailContent = `
//     <h2>Report Details</h2>
//     <p><strong>Project ID:</strong> ${project_id}</p>
//     <p><strong>Task Name:</strong> ${task_name}</p>
//     <p><strong>Report Type:</strong> ${report_type}</p>
//     <p><strong>Task Status:</strong> ${task_status}</p>
//     <p><strong>Description:</strong></p>
//     <p>${report_desc}</p>
//     <hr>
//     <h3>Submitted By:</h3>
//     <p><strong>Name:</strong> ${empName}</p>
//     <p><strong>Email:</strong> ${empEmail}</p>
//   `;

//   try {
//     // Sending Email
//     await transport.sendMail({
//       from: { address: "emp@gmail.com", name: empName },
//       to: ["karthikeyan2.0doc@gmail.com"],
//       subject: req.body.report_type,
//       text:req.body.report_desc // HTML content for the email
//        // Attachments if provided
//     });

//     res.status(200).json({ status: true, message: "Mail sent successfully" });
//   } catch (error) {
//     console.error("Error sending mail:", error);
//     res.status(500).json({ status: false, message: "Mail sending failed." });
//   }
// });