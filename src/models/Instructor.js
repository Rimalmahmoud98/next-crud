import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 1,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email'],
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in development hot reload
const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);

export default Instructor;