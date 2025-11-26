// REST API endpoint for handling the list of students (GET all + POST create)
// Located at: http://localhost:3000/api/students

import { NextResponse } from 'next/server';           // Next.js utility to send JSON responses with proper headers/status
import { connectToDatabase } from '@/lib/db';       // Our custom MongoDB connection function (cached for performance)
import Student from '@/models/Student';             // Mongoose model for the "Student" collection

// =============================================
// GET: Fetch all students from the database
// Route: GET /api/students
// =============================================
export async function GET() {
  try {
    // Establish (or reuse) connection to MongoDB Atlas
    await connectToDatabase();

    // Query all students, sorted by creation date (newest first)
    // .sort({ createdAt: -1 }) → -1 = descending
    const students = await Student.find({}).sort({ createdAt: -1 });

    // Return the array of students as JSON with 200 OK status
    return NextResponse.json(students);
  } catch (error) {
    // Log the full error to server console for debugging
    console.error('GET /api/students error:', error);

    // Return user-friendly error message with 500 Internal Server Error
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// =============================================
// POST: Create a new student
// Route: POST /api/students
// Expects JSON body: { "name": "...", "age": 20, "email": "..." }
// =============================================
export async function POST(request) {
  try {
    // Ensure DB connection is ready (cached after first call)
    await connectToDatabase();

    // Parse the incoming JSON body from the request
    const body = await request.json();

    // Destructure required fields from the request body
    const { name, age, email } = body;

    // Basic validation: ensure all required fields are present
    if (!name || !age || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 } // 400 Bad Request
      );
    }

    // Create a new Student document using the Mongoose model
    const student = new Student({ name, age, email });

    // Save the student to MongoDB (triggers validation & unique checks)
    await student.save();

    // Return the created student with 201 Created status
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    // Log full error for server-side debugging
    console.error('POST /api/students error:', error);

    // Handle duplicate email error (MongoDB error code 11000 = unique constraint violation)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // For any other error (e.g., validation, DB down), return generic message
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}