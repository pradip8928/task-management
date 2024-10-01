const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);