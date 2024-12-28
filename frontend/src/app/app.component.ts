import { Component } from '@angular/core';
import * as AOS from 'aos';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  isLoggedIn:boolean=false;
  
  constructor(public authService:AuthService){
    this.isLoggedIn = authService.isLoggedIn();
    
  }

  ngOnInit(): void {
    AOS.init({
      duration: 1000, 
      easing: 'ease-in-out', 
      once: true, 
    });
   
  }
}
