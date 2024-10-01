const express = require('express');
const Task = require("../models/taskModel");
const User = require("../models/userModel")
const validateTask = require("../validation/taskValidation");


const createTask = async(req, res) => {

    const { error } = validateTask(req.body);
    console.log("Validation Result:", error);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { title, description, dueDate, status, assignedUser, priority } = req.body;

    try {



        const userExists = await User.findById(assignedUser);
        console.log(`userExists ${userExists}`);

        if (!userExists) {
            return res.status(404).json({ message: 'Assigned user does not exist' });
        }
        const task = new Task({
            title,
            description,
            dueDate,
            status,
            assignedUser,
            priority,
            createdBy: req.user._id,
        });
        console.log(task);

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Error during task creation:", error);
        res.status(400).json({ message: error.message });
    }
}

const updateTask = async(req, res) => {

    const { error } = validateTask(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { title, description, dueDate, status, priority, assignedUser } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, {
            title,
            description,
            dueDate,
            status,
            priority,
            assignedUser
        }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteTask = async(req, res) => {


    try {

        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task Not Found" });
        res.json({ message: "Task Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTask = async(req, res) => {

    const page = parseInt(req.query.page) || 1; //default 1 page
    const limit = parseInt(req.query.limit) || 10; //Default 10 task per page 
    const skipIndex = (page - 1) * limit;
    try {

        const baseQuery = req.user.role === 'admin' ? {} : {
            $or: [
                { createdBy: req.user._id },
                { assignedUser: req.user._id }
            ]
        };

        const { status, priority, search } = req.query;


        const query = {
            ...baseQuery,
            ...(status && { status }),
            ...(priority && { priority }),
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            })

        }



        //Get tasks with pagination
        const tasks = await Task.find(query).skip(skipIndex).limit(limit).populate('assignedUser', 'username').populate('createdBy', 'username');


        const totalTasks = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / limit);
        // Check if tasks were found
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.json({ currentPage: page, totalPages: totalPages, tasks: tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const getTaskSummary = async(req, res) => {
    const { userId, status, startDate, endDate } = req.query;

    const query = {
        ...(userId && { assignedUser: userId }),
        ...(status && { status }),
        ...(startDate && endDate && {
            dueDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
    }


    try {
        const tasks = await Task.find(query).populate('assignedUser', 'username');
        const summaryReport = tasks.map(task => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            priority: task.priority,
            assignedUser: task.assignedUser,
            createdBy: task.createdBy
        }));

        if (summaryReport.length == 0) {
            return res.status(404).json({ message: "No Task found for given criteria" })
        }

        if (req.query.format == "csv") {
            const csv = convertToCSV(summaryReport);
            res.header("Content-Type", "text/csv");
            res.attachment('task_summary_report.csv');
            return res.send(csv);
        }
        res.json(summaryReport); // Default to JSON format
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(",") + '\n';
    const rows = data.map(row => Object.values(row).join(",")).join("\n");
    return headers + rows;
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getTaskSummary
}