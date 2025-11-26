// src/models/Student.js
// Mongoose schema and model for the "Student" collection
// Defines structure, validation, and behavior of student documents

import mongoose from 'mongoose'; // Mongoose ODM — makes MongoDB easy and safe to use

// Define the schema — this enforces data structure and validation
const studentSchema = new mongoose.Schema(
    {
        // Full name of the student
        name: {
            type: String,                    // Must be a string
            required: [true, 'Name is required'], // Required + custom error message
            trim: true,                      // Automatically remove leading/trailing whitespace
        },

        // Age in years
        age: {
            type: Number,                    // Must be a number
            required: [true, 'Age is required'],
            min: [1, 'Age must be at least 1'], // Minimum valid age
            // max: [120, 'Age seems too high'] // Optional: add upper limit
        },

        // Email address — used for uniqueness and contact
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,                    // Enforces no duplicate emails in DB
            lowercase: true,                 // Automatically convert to lowercase before saving
            trim: true,                      // Remove whitespace
            match: [
                /^\S+@\S+\.\S+$/,              // Regex for basic email format validation
                'Please use a valid email address', // Error message if regex fails
            ],
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
        // Collection name will be "students" (pluralized by default)
        // You can force it with: collection: 'students'
    }
);

/**
 * Critical fix for Next.js development hot reloading
 * 
 * In development, when you save a file, Next.js reloads modules.
 * Without this check, mongoose.model('Student') would be called twice
 * → throws "OverwriteModelError: Cannot overwrite `Student` model"
 * 
 * In production, this is safe and only runs once.
 */
const Student = mongoose.models.Student
    ? mongoose.models.Student
    : mongoose.model('Student', studentSchema);

// Export the model so it can be used in API routes and server actions
export default Student;