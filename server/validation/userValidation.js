const Joi = require('joi');



// Validation schema for user registration
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('user', 'admin').optional()
    });

    return schema.validate(data);
};

// Validation schema for user login  
const loginValidation = (data) => {
    const schema = Joi.object({

        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
};