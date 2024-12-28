const userService = require("./userService");

var userCreate = async (req, res) => {
    try {
        
        var result = await userService.userCreateService(req.body);
        
        if (result) {
            console.log("Controller:Admin Registration success");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
};



var userLogin = async (req, res) => {
    try {
        const result = await userService.userLoginService(req.body);
        console.log("Result:",result);
        if (result.status) {
            res.status(200).json(result); 
            console.log("Result:",result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error("Login Controller Error:", error);
        res.status(500).json({ status: false, message: "Server error: " + error.message });
    }
};

var userCreateEmp=async(req,res)=>{
    debugger;
    try {
        
        var result = await userService.userCreateEmpService(req.body);
        if (result) {
            console.log("Controller:Employee Added successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var userCreateProject =async(req,res)=>{
    try {
        
        var result = await userService.userCreateProjectService(req.body);
        if (result) {
            console.log("Controller:Project Created Successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}
var userCreateTasks=async(req,res)=>{
    try {
        
        var result = await userService.userCreateTasksService(req.body);
        if (result) {
            console.log("Controller:Tasks Created Successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var getProjectDetails= async(req,res)=>{
    try {
        
        var result = await userService.getProjectDetailsService(req.body);
        if (result) {
            console.log("Controller:projects listed Successfully");
            res.status(200).json({ status: true, message: result.message,projects:result.projects });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var getSingleProject = async (req, res) => {
    try {
        var result = await userService.getSingleProjectService(req.body);
        console.log(req.body);

        if (result.status) {  // Check if the result is successful
            console.log("Controller: Project details Listed");
            res.status(200).json({ status: true, message: result.message, project: result.project });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
};

var getSingleEmployee= async (req, res) => {
    try {
        var result = await userService.getSingleEmployeeService(req.body);
        console.log(req.body);

        if (result.status) {  // Check if the result is successful
            console.log("Controller: Employee details Listed");
            res.status(200).json({ status: true, message: result.message,employee: result.employee });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
};

var getSingleTask =async(req,res)=>{
    try {
        var result = await userService.getSingleTaskService(req.body);
        console.log(req.body);

        if (result.status) { 
            console.log("Controller: Task details Listed");
            res.status(200).json({ status: true, message: result.message,task: result.task });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var getEmployeeDetails = async(req,res)=>{
    try {
        
        var result = await userService.getEmployeeDetailsService(req.body);
        if (result) {
            console.log("Controller:Employees listed Successfully");
            res.status(200).json({ status: true, message: result.message,employees:result.employees });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var getTasksDetails = async(req,res)=>{
    try {
        
        var result = await userService.getTasksDetailsService(req.body);
        if (result) {
            console.log("Controller:Tasks listed Successfully");
            res.status(200).json({ status: true, message: result.message,tasks:result.tasks });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var EditProjectDetails = async(req,res)=>{
    try {
        
        var result = await userService.userEditProjectService(req.body);
        if (result) {
            console.log("Controller:Project Edited Successfully");
            res.status(200).json({ status: true, message: result.message,project:result.project });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var DeleteProject=async(req,res)=>{
    try {
        
        var result = await userService.DeleteProjectService(req.body);
        if (result) {
            console.log("Controller:Project Deleted Successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}


var DeleteEmployee=async(req,res)=>{
    try {        
        var result = await userService.DeleteEmployeeService(req.body);
        if (result) {
            console.log("Controller:Employee Deleted Successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var EditEmployeeDetails = async(req,res)=>{
    try {
        var result = await userService.EditEmployeeDetailsService(req.body);
        if (result) {
            console.log("Controller:Employee Edited Successfully");
            res.status(200).json({ status: true, message: result.message,project:result.project });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var EditTaskDetails =async(req,res)=>{
    try {
        var result = await userService.EditTaskDetailsService(req.body);
        if (result) {
            console.log("Controller:Task Edited Successfully");
            res.status(200).json({ status: true, message: result.message,task:result.task });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var DeleteTask = async(req,res)=>{
    try {        
        var result = await userService.DeleteTaskService(req.body);
        if (result) {
            console.log("Controller:Task Deleted Successfully");
            res.status(200).json({ status: true, message: result.message });
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

var updateStatus = async (req,res)=>{
    try {
        var result = await userService.updateTaskStatusService(req.body);
        if (result) {
            console.log("Controller:Task Updated Successfully");
            res.status(200).json({ status: true, message: result.message});
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}


const getAllFiles = async(req,res)=>{
    try {
        var result = await userService.getAllFilesService(req.body);
        if (result) {
            console.log("Controller:Files retrived Successfully");
            res.status(200).json({ status: true, message: result.message,files:result.files});
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

const getAllAdminFiles = async(req,res)=>{
    try {
        var result = await userService.getAllAdminFilesService(req.body);
        if (result) {
            console.log("Controller:Files retrived Successfully");
            res.status(200).json({ status: true, message: result.message,files:result.files});
        } else {
            res.status(400).json({ status: false, message: result.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ status: false, message: "Error: " + error.message });
    }
}

module.exports = { 
    userCreate ,
    userLogin,
    userCreateEmp,
    userCreateProject ,
    userCreateTasks,
    getProjectDetails,
    getSingleProject,
    getTasksDetails,
    getEmployeeDetails,
    EditProjectDetails,
    DeleteProject,
    EditEmployeeDetails,
    getSingleEmployee,
    DeleteEmployee,
    getSingleTask,
    EditTaskDetails ,
    DeleteTask,
    updateStatus,
    getAllFiles,
    getAllAdminFiles
};
