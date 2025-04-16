const Joi = require('joi');

// Validation schema for login input
const loginSchema = Joi.object({
  identifier: Joi.string().required(), // Email or mobile as identifier
  password: Joi.string().required(), // Password is required
});

// Validation schema for registration input
const registerSchema = Joi.object({
  email: Joi.string().email().required(), // Email must be a valid email format and is required
  password: Joi.string().min(6).required(), // Password must be at least 6 characters long and is required
  mobile: Joi.string().required(), // Mobile number is required; you can add more specific validation if needed
});

// Validate login input
const validateLoginInput = (data) => {
  return loginSchema.validate(data); // Validate data against login schema
};

// Validate registration input
const validateRegisterInput = (data) => {
  return registerSchema.validate(data); // Validate data against registration schema
};

module.exports = { validateLoginInput, validateRegisterInput };