const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/routes");
const Nodemailer = require("nodemailer");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { userSchemaModel, employeeSchemaModel,taskSchemaModel } = require("./userController/userModel");

app.use(routes);



mongoose.connect("mongodb+srv://karthikeyan2207:karthi@projectmanagementsystem.mrivw.mongodb.net/?retryWrites=true&w=majority&appName=ProjectManagementSystem/", { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("error:", err);
  });

app.get('/api/admin/details', async (req, res) => {
  const { email } = req.query;

  try {
    const admin = await userSchemaModel.find({ email, role: 'admin' });

    if (!admin) {
      return res.status(404).json({ status: false, message: 'Admin not found.' });
    }

    res.status(200).json({ status: true, adminDetails: admin });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/employee/details', async (req, res) => {
  const { email } = req.query;

  try {
    const employee = await employeeSchemaModel.find({ empEmail: email });

    if (!employee) {
      return res.status(404).json({ status: false, message: 'Employee not found.' });
    }

    res.status(200).json({ status: true, employeeDetails: employee });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ status: false, message: error.message });
  }
});


const GMAIL_USER = "karthikeyan2.0doc@gmail.com"; 
const GMAIL_PASS = "whme cwrl cyih fmtn"; 
const { MailtrapTransport } = require("mailtrap");
const TOKEN = "efe19273f8f97fd2c9c612e3f7f19b37";
const fs =require("fs");
const path=require("path");
app.post("/user/sendEmail", async (req, res) => {
  const transport = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });


  //   const transport = Nodemailer.createTransport(
  //   MailtrapTransport({
  //     token: TOKEN,
  //     testInboxId: 3341042,
  //   })
  // );
  
  const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #e0ffe0, #f9fff9) !important;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow:1px 1px 5px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(45deg, #40d522, #40d522);
            color: #ffffff;
            text-align: center;
            padding: 20px;
            
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            /* border-left: 2px solid rgba(128, 128, 128, 0.404);
            border-bottom: 2px solid rgba(128, 128, 128, 0.404); */
        }
        .email-body h2 {
            color:#40d522;
            margin-top: 0;
        }
        .email-body p {
            margin: 10px 0;
        }
        .task-table {
            width: 100%;
           
            margin-top: 20px;
        }
        .task-table th, .task-table td {
            border: 1px solid #dddddd;
            text-align: left;
            border-radius: 3px;
            padding: 8px;
        }
        .task-table th {
            background-color: #f2f2f2;
        }
        
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${req.body.report_type} Notification</h1>
        </div>
        <div class="email-body">
            <h2>Project Details</h2>
            <table class="task-table">
                <tr>
                    <th>Project ID</th>
                    <td>${req.body.project_id}</td>
                </tr>
                <tr>
                    <th>Task Name</th>
                    <td>${req.body.task_name}</td>
                </tr>
                <tr>
                    <th>Report Type</th>
                    <td>${req.body.report_type}</td>
                </tr>
                <tr>
                    <th>Report Description</th>
                    <td>${req.body.report_desc}</td>
                </tr>
                <tr>
                    <th>Employee Name</th>
                    <td>${req.body.empName}</td>
                </tr>
                <tr>
                    <th>Employee Email</th>
                    <td>${req.body.empEmail}</td>
                </tr>
                <tr>
                    <th>Task Status</th>
                    <td>${req.body.task_status}</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
`

console.log(req.body.attachments);
  try {
    await transport.sendMail({
      from: { address: req.body.empEmail, name: req.body.empName },
      to: GMAIL_USER, 
      subject: req.body.report_type || "Report Submission", 
      html: emailContent,
      // attachments:{
      //   filename:"email.jpg",
      //   path:req.body.attachments,
      //   cid:"email.jpg"
      // },
      category: "Integration Test",
      sandbox: true
    });

    res.status(200).json({ status: true, message: "Mail sent successfully" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ status: false, message: "Mail sending failed." });
  }
});



const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


app.put('/employee/updateStatus', upload.single('attachments'), async (req, res) => {
  try {
    const { task_id, task_status, employeeEmail,fileUploaded } = req.body;
    const attachment = req.file;

    if (!task_id || !task_status) {
      return res.status(400).json({ status: false, message: 'Invalid Update' });
    }

    const employee = await employeeSchemaModel.findOne({ empEmail: employeeEmail });
    if (!employee) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    const task = await taskSchemaModel.findById(task_id);
    if (!task) {
      return res.status(404).json({ status: false, message: 'Task not found' });
    }
    if (attachment) {
      const file = {
        fileName: attachment.originalname,
        filePath: attachment.path,
        task_id:task_id,
        uploadedBy:employee.empEmail,
        uploadedAt: Date.now()
      };

      task.task_status = task_status;
      task.fileUploaded = fileUploaded;

      task.files.push(file);
      await task.save();

      employee.files.push(file);
      await employee.save();
    }
    
    res.status(200).json({ status: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/download/*', (req, res) => {
  const filePath = req.params[0]; 
  const absoluteFilePath = path.join(__dirname, filePath);

  // Ensure the file exists before sending it
  res.download(absoluteFilePath, (err) => {
    if (err) {
      console.error('Error while downloading the file:', err);
      res.status(404).json({ status: false, message: 'File not found' });
    }
  });
});
app.get('/', (req, res) => {
  res.send('Server is running');
});


//DELETE FILE

app.post('/employee/deleteFile', async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const {task_id, filePath, uploadedBy } = req.body;

    const employee = await employeeSchemaModel.findOne({ empEmail: uploadedBy });
    if (!employee) {
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }

    const task = await taskSchemaModel.findOne({_id:task_id});
    console.log("task:",task);
    

    const fileIndex1 = employee.files?.findIndex(file => file.filePath === filePath) ?? -1;
    const fileIndex2 = task.files.findIndex(file => file.filePath === filePath) ;
    console.log(fileIndex1,fileIndex2);
    if (fileIndex1 === -1) {
      return res.status(404).json({ status: false, message: 'File not found in employee records' });
    }
    if (fileIndex2 === -1) {
      return res.status(404).json({ status: false, message: 'File not found in task records' });
    }
    
    const fullFilePath = path.join(__dirname, filePath);


    fs.access(fullFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File not found on server:', fullFilePath);
        return res.status(404).json({ status: false, message: 'File not found on server' });
      }

      fs.unlink(fullFilePath, async (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ status: false, message: 'Error deleting file from server' });
        }

        employee.files.splice(fileIndex1, 1);
        await employee.save();

        task.fileUploaded = false;
        task.files.splice(fileIndex2,1);
        await task.save();

        console.log('File deleted successfully from server and database');
        res.status(200).json({ status: true, message: 'File deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: false, message: 'An unexpected error occurred' });
  }
});




app.listen(3000, () => {
  console.log("Server running on port 3000");
});






















// app.post('/employee/deleteFile', async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { task_id, filePath, uploadedBy } = req.body;

//     const employee = await employeeSchemaModel.findOne({ empEmail: uploadedBy });
//     if (!employee) {
//       return res.status(404).json({ status: false, message: 'Employee not found' });
//     }

//     const task = await taskSchemaModel.findOne({ _id: task_id });
//     if (!task) {
//       return res.status(404).json({ status: false, message: 'Task not found' });
//     }

//     if (!Array.isArray(employee.files)) {
//       employee.files = [];
//     }

//     if (!Array.isArray(task.files)) {
//       task.files = [];
//     }

//     const fileIndex1 = employee.files.findIndex(file => file.filePath === filePath);
//     const fileIndex2 = task.files.findIndex(file => file.filePath === filePath);

//     if (fileIndex1 === -1) {
//       return res.status(404).json({ status: false, message: 'File not found in employee records' });
//     }

//     if (fileIndex2 === -1) {
//       return res.status(404).json({ status: false, message: 'File not found in task records' });
//     }

//     const fullFilePath = path.join(__dirname, filePath);

//     fs.access(fullFilePath, fs.constants.F_OK, (err) => {
//       if (err) {
//         console.error('File not found on server:', fullFilePath);
//         return res.status(404).json({ status: false, message: 'File not found on server' });
//       }

//       fs.unlink(fullFilePath, async (err) => {
//         if (err) {
//           console.error('Error deleting file:', err);
//           return res.status(500).json({ status: false, message: 'Error deleting file from server' });
//         }

//         employee.files.splice(fileIndex1, 1);
//         await employee.save();

//         task.fileUploaded = false;
//         task.files.splice(fileIndex2, 1);
//         await task.save();

//         console.log('File deleted successfully from server and database');
//         res.status(200).json({ status: true, message: 'File deleted successfully' });
//       });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ status: false, message: 'An unexpected error occurred' });
//   }
// });
