const joi = require('joi');

const taskSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    description: joi.string().min(5).max(500).required(),
    dueDate: joi.date().greater('now').required(),
    status: joi.string().valid('To Do', 'In Progress', 'Completed').optional(),
    assignedUser: joi.string().required(),
    priority: joi.string().valid('Low', 'Medium', 'High').optional(),
});


const validateTask = (task) => {
    return taskSchema.validate(task)
}

module.exports = validateTask;