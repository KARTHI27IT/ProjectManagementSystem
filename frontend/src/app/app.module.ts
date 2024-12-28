import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { CreateEmployeeComponent } from './project/create-employee/create-employee.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { CreateTasksComponent } from './project/create-tasks/create-tasks.component';

import { EditTaskComponent } from './project/edit-task/edit-task.component';
import { EditEmployeeComponent } from './project/edit-employee/edit-employee.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeTaskTableComponent } from './employee-task-table/employee-task-table.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ReportComponent } from './task-details/report/report.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {DataTablesModule} from "angular-datatables";
import { EmployeeFilesComponent } from './employee-files/employee-files.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashbordComponent,
    ProjectComponent,
    CreateProjectComponent,
    CreateEmployeeComponent,
    SidebarComponent,
    ProjectTableComponent,
    EmployeeTableComponent,
    CreateTasksComponent,
    EditProjectComponent,
    EditTaskComponent,
    EditEmployeeComponent,
    EmployeeDashboardComponent,
    EmployeeTaskTableComponent,
    TaskDetailsComponent,
    ReportComponent,
    EmployeeFilesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatProgressBarModule,
    DataTablesModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
