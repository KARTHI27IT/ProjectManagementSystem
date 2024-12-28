import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { audit } from 'rxjs';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneno: string = ''; // Changed to string for better validation
  loading: boolean = false; // For UX enhancements
  url:String="";
  constructor(private http: HttpClient, private router: Router,public authService:AuthService) {}

  register() {
    this.url = this.authService.apiUrl;
    // Basic client-side validations
    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.phoneno) {
      alert('All fields are required!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    

    // Show loading indicator
    this.loading = true;

    const userPayload = {
      name: this.name,
      email: this.email,
      password: this.password,
      phoneno: this.phoneno,
    };

    this.http.post<{status:boolean,message:String}>(
      `${this.url}:3000/user/create`,
      userPayload
    ).subscribe(
      (resultData) => {
        this.loading = false;
        if (resultData) {
          Swal.fire({
            title: 'Success!',
            text: "registration successful",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/login']);
        } else {
          Swal.fire({
            title: 'Error!',
            text: "registration failed",
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
      },
      (error) => {
        this.loading = false;
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
