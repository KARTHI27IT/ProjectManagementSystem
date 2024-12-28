import { createPlatform, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ProjectComponent } from './project/project.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { CreateEmployeeComponent } from './project/create-employee/create-employee.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { CreateTasksComponent } from './project/create-tasks/create-tasks.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { EditEmployeeComponent } from './project/edit-employee/edit-employee.component';
import { EditTaskComponent } from './project/edit-task/edit-task.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeTaskTableComponent } from './employee-task-table/employee-task-table.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ReportComponent } from './task-details/report/report.component';
import { EmployeeFilesComponent } from './employee-files/employee-files.component';

const routes: Routes = [
  {path:"",component:DashbordComponent},
  {path:"dashbord",component:DashbordComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"project/:id",component:ProjectComponent},
  {path:"createProject",component:CreateProjectComponent},
  {path:"createEmployee",component:CreateEmployeeComponent},
  {path:"projectTable",component:ProjectTableComponent},
  {path:"employeeTable",component:EmployeeTableComponent},
  // {path:"createTasks/:id",component:CreateTasksComponent},
  {path:"EditProject/:id",component:EditProjectComponent},
  {path:"EditEmployee/:id",component:EditEmployeeComponent},
  {path:"editTask/:id",component:EditTaskComponent},
  {path:"employeeDashboard",component:EmployeeDashboardComponent},
  {path:"taskTable",component:EmployeeTaskTableComponent},
  {path:"TaskDetails/:id",component:TaskDetailsComponent},
  {path:"employeeReport/:id",component:ReportComponent},
  {path:"createTasks/:id/start/:start/end/:end",component:CreateTasksComponent},
  {path:"employeeFiles",component:EmployeeFilesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
