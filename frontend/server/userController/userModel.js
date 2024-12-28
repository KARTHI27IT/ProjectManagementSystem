const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tasksIdSchema=new Schema({
    project_id:{type:String},
    task_id:{type:String},
});
const employeesIdSchema=new Schema({
    employee_id:{type:String}
})
const projectsIdSchema=new Schema({
    project_id:{type:String}
})
const fileSchema = new mongoose.Schema({
    fileName: String,
    filePath: String,
    task_id:String,
    uploadedBy:String,
    uploadedAt: { type: Date, default: Date.now }
});

const taskSchema = new Schema({
    project_id: { type: String, required: true },
    task_name: { type: String, required: true },
    task_desc: { type: String, required: true },
    task_start: { type: Date, required: true },
    task_end: { type: Date, required: true },
    task_status: {
      type: String,
      enum: ['planned', 'started', 'pending', 'in progress', 'under review', 'completed'],
      required: true
    },
    task_assigned_to: { type: String, required: true },
    fileUploaded:{type:String},
    files:[fileSchema]
  }); 

const employeeSchema = new Schema({
    Admin: { type: String, required: true },
    empName: { type: String, required: true },
    empEmail: { type: String, required: true, unique: true },
    empPassword: { type: String, required: true },
    empPhoneno: { type: String, required: true },
    assignedTask:[tasksIdSchema],
    files:[fileSchema]
});



const projectSchema = new Schema({
    project_name: { type: String, required: true },
    project_desc: { type: String, required: true },
    project_start: { type: Date, required: true },
    project_end: { type: Date, required: true },
    no_of_tasks:{type:String,require:true},
    project_status:{type:String,require:true},
    tasks:[tasksIdSchema]
});


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneno: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    employees: [employeesIdSchema],
    projects: [projectsIdSchema]
});



const userSchemaModel = mongoose.model('user', userSchema);
const employeeSchemaModel = mongoose.model('employee', employeeSchema);
const projectSchemaModel = mongoose.model('project',projectSchema);
const taskSchemaModel = mongoose.model('task',taskSchema);


module.exports = {
    userSchemaModel,
    employeeSchemaModel,
    projectSchemaModel,
    taskSchemaModel,
};
