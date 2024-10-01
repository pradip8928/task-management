const express = require('express');

const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const verifyRole = require("../middleware/roleMiddleware");

const { createTask, updateTask, deleteTask, getTask, getTaskSummary } = require("../controller/taskController");

router.post('/', verifyToken, verifyRole('admin'), createTask)


router.put("/:id", verifyToken, verifyRole('admin'), updateTask)

router.delete("/:id", verifyToken, verifyRole('admin'), deleteTask);


router.get("/", verifyToken, getTask);
router.get("/summary", verifyToken, getTaskSummary);


module.exports = router;