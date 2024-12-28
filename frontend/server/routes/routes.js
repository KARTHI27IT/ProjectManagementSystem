const express = require("express");
const userController = require("../userController/userController"); // Ensure path is correct
const router = express.Router();

router.route("/user/create").post(userController.userCreate);
router.route("/user/login").post(userController.userLogin);
router.route("/user/createEmp").post(userController.userCreateEmp);
router.route("/user/createProject").post(userController.userCreateProject);
router.route("/user/createTasks").post(userController.userCreateTasks);
router.route("/user/projects").post(userController.getProjectDetails);
router.route("/user/employees").post(userController.getEmployeeDetails);
router.route("/employee/getAllFiles").post(userController.getAllFiles);
router.route("/admin/getAllFiles").post(userController.getAllAdminFiles);

router.route("/user/SingleProject").post(userController.getSingleProject);
router.route("/user/SingleEmployee").post(userController.getSingleEmployee);
router.route("/user/SingleTask").post(userController.getSingleTask);

router.route("/user/getTasks").post(userController.getTasksDetails);
router.route("/user/EditProject").put(userController.EditProjectDetails);
router.route("/user/EditEmployee").put(userController.EditEmployeeDetails);
router.route("/user/EditTask").put(userController.EditTaskDetails);
// router.route("/employee/updateStatus").put(userController.updateStatus);

router.route("/user/DeleteProject").delete(userController.DeleteProject);
router.route("/user/DeleteEmployee").delete(userController.DeleteEmployee);
router.route("/user/DeleteTask").delete(userController.DeleteTask);




module.exports = router;
