import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isLoggedIn:any;
  isEmployee:boolean=false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const employeeStatus = localStorage.getItem("isEmployee");
    this.isEmployee = employeeStatus === 'true';
  }
  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

}
