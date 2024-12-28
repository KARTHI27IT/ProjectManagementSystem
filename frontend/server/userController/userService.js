const { userSchemaModel,employeeSchemaModel,projectSchemaModel,taskSchemaModel } = require('./userModel');


// CREATE PROJECT
module.exports.userCreateService = async (UserDetails) => {
    try {

        const existingUser = await userSchemaModel.findOne({ email: UserDetails.email });

        if (existingUser) {
            return { status: false, message: "Email already exists. Please use a different email." };
        }
        
        var userModelData = new userSchemaModel({
            name: UserDetails.name,
            email: UserDetails.email,
            password: UserDetails.password,
            phoneno: UserDetails.phoneno,
            role: 'admin'  
        });

        var result = await userModelData.save();
        
        if (result) {
            console.log(`${userModelData.name} is registered successfully`);
            return { status: true, message: "Admin registration successful!" };
        } else {
            return { status: false, message: "Registration failed" };
        }
    } catch (error) {
        console.error('Error occurred while creating admin:', error);
        return { status: false, message: "Error: " + error.message };
    }
};


//CREATE EMPLOYEE


module.exports.userCreateEmpService = async (EmployeeDetails) => {
    try {
        const adminUser = await userSchemaModel.findOne({ email: EmployeeDetails.adminEmail });
        
        if (!adminUser) {
            return { status: false, message: "Admin user not found." };
        }

        const existingEmp = await employeeSchemaModel.findOne({ empEmail: EmployeeDetails.empEmail });
        if (existingEmp) {
            return { status: false, message: "Email already exists. Please use a different email." };
        }

        const employee = new employeeSchemaModel({
            Admin: EmployeeDetails.adminEmail,
            empName: EmployeeDetails.empName,
            empEmail: EmployeeDetails.empEmail,
            empPassword: EmployeeDetails.empPassword,
            empPhoneno: EmployeeDetails.empPhoneno
        });

        const result = await employee.save();

        if (result) {
            adminUser.employees.push(employee._id);
            await adminUser.save();
            console.log(`${employee.empName} employee is created successfully`);
            return { status: true, message: `${employee.empName} employee is created successfully` };
        } else {
            return { status: false, message: "Employee creation failed" };
        }

    } catch (error) {
        console.error('Error occurred while creating employee:', error);
        return { status: false, message: "Error: " + error.message };
    }
};

//CREATE PROJECT

module.exports.userCreateProjectService = async (projectDetails) => {
    try {
        if (!projectDetails.project_name || !projectDetails.project_desc || !projectDetails.project_start || !projectDetails.project_end) {
            return { status: false, message: 'All required project fields are not provided.' };
        }

        const adminUser = await userSchemaModel.findOne({ email: projectDetails.adminEmail });

        if (!adminUser) {
            console.error(`Admin not found for email: ${projectDetails.adminEmail}`);
            return { status: false, message: `Admin not found for email: ${projectDetails.adminEmail}` };
        }

        if (!adminUser.projects) {
            adminUser.projects = [];  
        }

        const existingProject = await projectSchemaModel.findOne({
            project_name: projectDetails.project_name
        });

        if (existingProject) {
            return { status: false, message: `Project with name ${projectDetails.project_name} already exists.` };
        }

        const project = new projectSchemaModel({
            project_name: projectDetails.project_name,
            project_desc: projectDetails.project_desc,
            project_start: projectDetails.project_start,
            project_end: projectDetails.project_end,
            no_of_tasks: projectDetails.no_of_tasks,
            project_status:projectDetails.project_status
        });

        const result = await project.save();

        if (result) {
            adminUser.projects.push(project._id);  
            await adminUser.save();  

            console.log(`${project.project_name} project is created successfully`);
            return { status: true, message: `${project.project_name} project is created successfully`, project_id: project._id };
        } else {
            return { status: false, message: "Project creation failed" };
        }
    } catch (error) {
        console.error('Error occurred while creating project:', error);
        return { status: false, message: "Error: " + error.message };
    }
};




//CREATE TASKS

module.exports.userCreateTasksService = async (tasksDetails) => {
    try {
        const project = await projectSchemaModel.findOne({ _id: tasksDetails.project_id });

        if (!project) {
            console.error(`Project not found for email: ${tasksDetails.project_id }`);
            return { status: false, message: `Project not found for email: ${tasksDetails.project_id }` };
        }
        
        const existingTask= await taskSchemaModel.findOne({task_name:tasksDetails.task_name});
        if(existingTask){
            console.log("task already created");
            return {status:false,message:`Task already fount with name ${tasksDetails.task_name}`};
        }

        
        
        const task = new taskSchemaModel({
            project_id:tasksDetails.project_id,
            task_name: tasksDetails.task_name,
            task_desc: tasksDetails.task_desc,
            task_start: tasksDetails.task_start,
            task_end:tasksDetails.task_end,
            task_status:tasksDetails.task_status,
            task_assigned_to:tasksDetails.task_assigned_to
        });

        const result = task.save();
        if(result){
            project.tasks.push(task._id);  
            await project.save();

            // ASSIGNING TASK TO EMPLOYEE
            const employee = await employeeSchemaModel.findOne({ empEmail: tasksDetails.task_assigned_to });
            if (employee) {
            
            employee.assignedTask.push({
                task_id:task._id,
                project_id:tasksDetails.project_id
            }); 
            await employee.save(); 
            console.log('Task assigned successfully');
            } else {
                console.log('Employee not found');
            }
            console.log(`Tasks added to project ${project.project_name}`);
            return { status: true, message: `Tasks successfully added to project ${project.project_name}` };
        }else{
            console.log("Tasks Failed to add");
            return { status: true, message: "Tasks Failed to add" };
        }
        
    } catch (error) {
        console.error('Error occurred while creating tasks:', error);
        return { status: false, message: "Error: " + error.message };
    }
};

const jwt = require('jsonwebtoken');

module.exports.userLoginService = async (UserDetails) => {
    try {
        let user, tokenPayload;

        if (!UserDetails.isEmployee) {
            user = await userSchemaModel.findOne({ email: UserDetails.email });
            if (user.password !== UserDetails.password) {
                return { status: false, message: 'Invalid password' };
            }
            if (user) {
                tokenPayload = {
                    userId: user._id,
                    email: user.email,
                };
            }
        } else {
            user = await employeeSchemaModel.findOne({ empEmail: UserDetails.email });
            if (user.empPassword !== UserDetails.password) {
                return { status: false, message: 'Invalid password' };
            }
            if (user) {
                tokenPayload = {
                    userId: user._id,
                    email: user.empEmail,
                };
            }
        }
        console.log(user);
        console.log(tokenPayload);
        if (!user) {
            return { status: false, message: 'User not found' };
        }

        

        const token = jwt.sign(
            tokenPayload,
            '1234', 
            { expiresIn: '1h' }
        );

        const userResponse = {
            name: UserDetails.isEmployee ? user.empName : user.name,
            email: UserDetails.isEmployee ? user.empEmail : user.email,
            phoneno: UserDetails.isEmployee ? user.empPhoneno : user.phoneno,
            isEmployee: UserDetails.isEmployee
        };

        return {
            status: true,
            message: 'Login successful',
            token,
            user: userResponse,
        };

    } catch (error) {
        console.error("Error in userLoginService:", error);
        return { status: false, message: 'Error: ' + error.message };
    }
};

//GET PROJECT DETAILS
module.exports.getProjectDetailsService = async (projectIds) => {
    try {
        console.log('Received projectIds:', projectIds);
        
        if (!projectIds || !Array.isArray(projectIds.projectIds)) {
            return { status: false, message: "Invalid or empty project IDs provided" };
        }

        const projectIdsArray = projectIds.projectIds;
        console.log('Extracted projectIdsArray:', projectIdsArray);

        const projects = await projectSchemaModel.find({ _id: { $in: projectIdsArray } });
        console.log('Retrieved projects:', projects);

        if (!projects || projects.length === 0) {
            return { status: false, message: "No projects found for the provided IDs" };
        }

        const totalProjects = projects.length;
        console.log(totalProjects);

        return { 
            status:true,
            message:"projects Listed successfully",
            projects:projects
        };
    } catch (error) {
        console.error('Error fetching project details:', error);
        return { status: false, message: "Error: " + error.message };
    }
};


//GET PROJECT DETAILS 

module.exports.getSingleProjectService = async (projectID) => {
    console.log(projectID);
    try {
        const project = await projectSchemaModel.find({ _id: projectID.project_id });
        
        if (project && project.length > 0) {  // Ensure the project array is not empty
            console.log("Service: Project Details retrieved Successfully");
            return { status: true, message: "Project Details retrieved Successfully", project: project };
        } else {
            console.log("Project not found");
            return { status: false, message: "Project Details Failed" };
        }
    } catch (error) {
        console.log("Error:", error);
        return { status: false, message: error.message };
    }
};


//GET SINGLE EMPLOYEE DETAILS 
module.exports.getSingleEmployeeService = async (Employee_id) => {
    console.log(Employee_id);
    try {
        const employee = await employeeSchemaModel.find({ _id: Employee_id.employee_id });
        console.log("employee:",employee);
        if (employee && employee.length > 0) {  // Ensure the project array is not empty
            console.log("Service: employee Details retrieved Successfully");
            return { status: true, message: "employee Details retrieved Successfully", employee:employee};
        } else {
            console.log("employee not found");
            return { status: false, message: "employee Details Failed" };
        }
    } catch (error) {
        console.log("Error:", error);
        return { status: false, message: error.message };
    }
};


//GET SINGLE TASKDETAILS
module.exports.getSingleTaskService =async(Task_id)=>{
    try{
        console.log(Task_id);
    const task =await taskSchemaModel.find({_id:Task_id.task_id});
    
    if(task){
        return {status:true,message:"Task Retrived",task:task};
    }else{
        return {status:false,message:"FailedtoRetriveTask"}
    }
    }catch(error){
        console.log("error:"+error);
        return {status:false,message:"error:"+error}
    }
}

//GET TASK DETAILS
module.exports.getTasksDetailsService = async(taskIds)=>{
    try {
        // console.log('Received tasksIds:', taskIds);
        const tasks = await taskSchemaModel.find({ _id: { $in: taskIds } });
        // console.log('Retrieved tasks:', tasks);

        if (!tasks || tasks.length === 0) {
            return { status: false, message: "No tasks found for the provided IDs" };
        }

        return { 
            status:true,
            message:"tasks Listed successfully",
            tasks:tasks
        };
    } catch (error) {
        console.error('Error fetching tasks details:', error);
        return { status: false, message: "Error: " + error.message };
    }
}


// GET EMPLOYEE DETAILS

module.exports.getEmployeeDetailsService = async (employeeIds) => {
    try {
        console.log('Received employeeIds:', employeeIds);

        
        const idsArray = employeeIds.employeeIds;
        console.log('Extracted IDs Array:', idsArray);

        // Fetching employees by their IDs
        const employees = await employeeSchemaModel.find({ _id: { $in: idsArray } });
        console.log('Retrieved Employees:', employees);

        if (!employees || employees.length === 0) {
            return { status: false, message: "No employees found for the provided IDs" };
        }

        return { 
            status: true,
            message: "Employees listed successfully",
            employees: employees
        };
    } catch (error) {
        console.error('Error fetching employee details:', error);
        return { status: false, message: "Error: " + error.message };
    }
};

//EDIT PROJECT DETAILS

module.exports.userEditProjectService = async (projectDetails) => {
    try {
        const project = await projectSchemaModel.findById(projectDetails.project_id);

        if (!project) {
            console.log("Project not found");
            return { status: false, message: "Project not found" };
        }

        project.project_name = projectDetails.project_name || project.project_name;
        project.project_desc = projectDetails.project_desc || project.project_desc;
        project.project_start = projectDetails.project_start || project.project_start;
        project.project_end = projectDetails.project_end || project.project_end;
        project.project_status = projectDetails.project_status || project.project_status;
        project.no_of_tasks = projectDetails.no_of_tasks || project.no_of_tasks;

        const updatedProject = await project.save();

        console.log("Project updated successfully");
        return { status: true, message: "Project updated successfully", project: updatedProject };
    } catch (error) {
        console.error("Error occurred while editing project:", error);
        return { status: false, message: "Error: " + error.message };
    }
};

//DELETE PROJECT
module.exports.DeleteProjectService = async (Project) => {
    try {
        const deletedProject = await projectSchemaModel.findByIdAndDelete(Project.project_id);
        if (!deletedProject) {
            console.log("Project not found");
            return { status: false, message: "Project not found" };
        }

        const deletedTasks = await taskSchemaModel.deleteMany({ project_id: Project.project_id });
        console.log(`Deleted ${deletedTasks.deletedCount} tasks associated with the project`);

        const employees = await employeeSchemaModel.find({ 'assignedTask.project_id': Project.project_id });
        for (const employee of employees) {
            employee.assignedTask = employee.assignedTask.filter(task => task.project_id !== Project.project_id);
            await employee.save();
        }
        console.log("Tasks removed from employees");

        const admin = await userSchemaModel.findOne({ email: Project.adminEmail });
        if (admin) {
            admin.projects = admin.projects.filter(p => p._id.toString() !== Project.project_id);
            await admin.save();
            console.log("Project ID removed from Admin's projects");
        } else {
            console.log("Admin not found");
        }

        console.log("Project deleted successfully");
        return { status: true, message: "Project deleted successfully", project: deletedProject };
    } catch (error) {
        console.error("Error occurred while deleting project:", error);
        return { status: false, message: "Error: " + error.message };
    }
};

//DELETE EMPLOYEE
module.exports.DeleteEmployeeService = async (Employee) => {
    try {
        const employee = await employeeSchemaModel.findByIdAndDelete(Employee.employee_id);
        
        if (!employee) {
            console.log("Employee not found");
            return { status: false, message: "Employee not found" };
        }

        for (let task of employee.assignedTask) {
            await taskSchemaModel.findByIdAndUpdate(task.task_id, { task_assigned_to: "" });
        }
        console.log("Employee deleted:", employee);

        const admin = await userSchemaModel.findOne({ email: Employee.adminEmail });
        if (admin) {
            admin.employees = admin.employees.filter(e => e._id.toString() !== Employee.employee_id);
            await admin.save();
            console.log("Employee ID removed from Admin's employees");
        } else {
            console.log("Admin not found");
        }

        return { status: true, message: "Employee deleted successfully" };
    } catch (error) {
        console.error("Error occurred while deleting employee:", error);
        return { status: false, message: "Error: " + error.message };
    }
};


//EDIT EMPLOYEE
module.exports.EditEmployeeDetailsService = async (EmployeeDetails) => {
    try {
        const employee = await employeeSchemaModel.findById(EmployeeDetails.employee_id);
        console.log("Editing Employee",employee);
        if (!employee) {
            console.log("Employee not found");
            return { status: false, message: "Employee not found" };
        }

        employee.empName = EmployeeDetails.empName || employee.empName;
        employee.empEmail = EmployeeDetails.empEmail || employee.empEmail;
        employee.empPassword = EmployeeDetails.empPassword || employee.empPassword;
        employee.empPhoneno = EmployeeDetails.empPhoneno || employee.empPhoneno;
        const updatedEmployee = await employee.save();

        console.log("employee updated successfully");
        console.log("Edited employee",updatedEmployee);
        return { status: true, message: "employee updated successfully", employee: updatedEmployee };
    } catch (error) {
        console.error("Error occurred while editing employee:", error);
        return { status: false, message: "Error: " + error.message };
    }
};

//EDIT TASK
module.exports.EditTaskDetailsService = async (tasksDetails) => {
    try {
      // Use findOne to fetch a single task document
      const task = await taskSchemaModel.findOne({ _id: tasksDetails.task_id });
      console.log("task:", task);
  
      const employees = await employeeSchemaModel.find({assignedTask: { $elemMatch: { task_id: tasksDetails.task_id } }});

      for(let employee of employees){
        const taskIndex = employee.assignedTask.findIndex(
          (assignedTask) => assignedTask.task_id.toString() === tasksDetails.task_id.toString()
        );
      
        if (taskIndex !== -1) {
          employee.assignedTask.splice(taskIndex, 1);
          await employee.save();
      
          console.log(`Task removed from employee: ${employee.empEmail}`);
        }
      }
      

      if (!task) {
        console.log("Task not found");
        return { status: false, message: "Task not found" };
      }
  
      // Update the task details
      task.task_name = tasksDetails.task_name || task.task_name;
      task.task_desc = tasksDetails.task_desc || task.task_desc;
      task.task_start = tasksDetails.task_start || task.task_start;
      task.task_end = tasksDetails.task_end || task.task_end;
      task.task_status = tasksDetails.task_status || task.task_status;
      task.task_assigned_to = tasksDetails.task_assigned_to || task.task_assigned_to;
  
      const updatedTask = await task.save();
  
      if (task.task_assigned_to) {
        const employee = await employeeSchemaModel.findOne({ empEmail: task.task_assigned_to });
  
        if (employee) {
          employee.assignedTask.push({
            project_id: task.project_id,
            task_id: task._id
          });
  
          await employee.save();
        } else {
          console.log("Employee not found");
          return { status: false, message: "Employee not found" };
        }
      }
  
      console.log("Task updated successfully");
      console.log("Edited task", updatedTask);
      return { status: true, message: "Task updated successfully", task: updatedTask };
  
    } catch (error) {
      console.log("Error: " + error);
      return { status: false, message: "Error: " + error };
    }
  };
  
//DELETE TASK DETAILS

module.exports.DeleteTaskService = async (Task) => {
    try {
        const task = await taskSchemaModel.findByIdAndDelete(Task.task_id);
        if (!task) {
            console.log("Task not found");
            return { status: false, message: "Task not found" };
        }

        const employee = await employeeSchemaModel.findOne({ empEmail: task.task_assigned_to });
       
        if (!employee) {
            console.log("Employee not found");
            return { status: false, message: "Employee not found" };
        }

        const taskIndex1 = employee.assignedTask.findIndex(
            (assignedTask) => assignedTask.task_id.toString() === task._id.toString()
        );

        const project = await projectSchemaModel.findById(task.project_id);
        if (!project) {
            console.log("Project not found");
            return { status: false, message: "Project not found" };
        }

        const taskIndex2 = project.tasks.findIndex(
            (tasks) => tasks._id.toString() === task._id.toString()
        );

        if (taskIndex1 !== -1) {
            employee.assignedTask.splice(taskIndex1, 1);
            project.tasks.splice(taskIndex2, 1);
            await employee.save();
            await project.save();

            console.log(`Task removed from employee: ${employee.empEmail}`);
        }

        return { status: true, message: "Task deleted and removed from employee successfully" };
    } catch (error) {
        console.log("Error:", error);
        return { status: false, message: "Error deleting task and removing from employee" };
    }
};

// GET ALL FILES SERVICE

module.exports.getAllFilesService =  async (employeeDetails) => {
    try {
      const employee = await employeeSchemaModel.findOne({ empEmail: employeeDetails.empEmail });
      if (!employee) {
        return { status: false, message: 'Employee not found' };
      }
      const files = employee.files;
      console.log(files);
      if (!files || files.length === 0) {
        return { status: false, message: 'No files found for this employee' };
      }
  
      return { status: true,message:"Files retrived Successfully", files:files };
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};
  


//GET ALL ADMIN FILES 

module.exports.getAllAdminFilesService = async(employeeIds)=>{

    const employees = await employeeSchemaModel.find({_id:{$in:employeeIds}});
    files=[];
    for(let employee of employees){
        files.push(employee.files);
        // if(employee.files.length)
    }
    
    return {status :true,message:"files retrived succesfully",files:files};
    
}


// module.exports.getProjectDetailsService = async (projectIds) => {
//     try {
//         console.log('Received projectIds:', projectIds);
        
//         if (!projectIds || !Array.isArray(projectIds.projectIds)) {
//             return { status: false, message: "Invalid or empty project IDs provided" };
//         }

//         const projectIdsArray = projectIds.projectIds;
//         console.log('Extracted projectIdsArray:', projectIdsArray);

//         const projects = await projectSchemaModel.find({ _id: { $in: projectIdsArray } });
//         console.log('Retrieved projects:', projects);

//         if (!projects || projects.length === 0) {
//             return { status: false, message: "No projects found for the provided IDs" };
//         }

//         const totalProjects = projects.length;
//         console.log(totalProjects);

//         return { 
//             status:true,
//             message:"projects Listed successfully",
//             projects:projects
//         };
//     } catch (error) {
//         console.error('Error fetching project details:', error);
//         return { status: false, message: "Error: " + error.message };
//     }
// };