import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone:false,
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn:any;
  isEmployee:boolean=false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const employeeStatus = localStorage.getItem("isEmployee");
    this.isEmployee = employeeStatus === 'true';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    window.location.reload(); 
  }
}
