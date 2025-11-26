// src/app/api/students/[id]/route.js
// Dynamic API route for individual student operations
// Handles: GET, PUT, DELETE for a single student by ID
// URL examples:
//   GET    → /api/students/671f3a9b2c1d4e5f789abc12
//   PUT    → /api/students/671f3a9b2c1d4e5f789abc12
//   DELETE → /api/students/671f3a9b2c1d4e5f789abc12

import { NextResponse } from 'next/server';           // Utility for sending JSON responses with correct status codes
import { connectToDatabase } from '@/lib/db';         // Reusable MongoDB connection with caching
import Student from '@/models/Student';               // Mongoose model representing the "students" collection

// =============================================
// GET: Retrieve a single student by ID
// =============================================
export async function GET(request, { params }) {
  // Extract the dynamic `id` from the URL (e.g., "671f3..." from /api/students/[id])
  const { id } = await params;

  try {
    // Connect to MongoDB (cached connection for performance)
    await connectToDatabase();

    // Find student by MongoDB ObjectId
    const student = await Student.findById(id);

    // If no student found with that ID → return 404
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 } // Not Found
      );
    }

    // Return the found student as JSON
    return NextResponse.json(student);
  } catch (error) {
    // Catches invalid ObjectId format (e.g., too short) or other DB issues
    console.error('GET /api/students/[id] error:', error);
    return NextResponse.json(
      { error: 'Invalid ID or server error' },
      { status: 400 } // Bad Request
    );
  }
}

// =============================================
// PUT: Update an existing student by ID
// Expects JSON body with updated fields
// =============================================
export async function PUT(request, { params }) {
  const { id } = await params; // Extract student ID from route

  try {
    await connectToDatabase(); // Ensure DB connection

    // Parse the incoming JSON body (e.g., { name: "John Updated", age: 25 })
    const body = await request.json();

    // Update student and return the NEW version of the document
    // runValidators: true → enforces schema rules (e.g., email format, age > 0)
    const student = await Student.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    // If no document was updated (ID doesn't exist)
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Successfully updated → return fresh student data
    return NextResponse.json(student);
  } catch (error) {
    console.error('PUT /api/students/[id] error:', error);

    // Handle validation errors, duplicate email, or malformed JSON
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 400 }
    );
  }
}

// =============================================
// DELETE: Permanently remove a student by ID
// =============================================
export async function DELETE(request, { params }) {
  const { id } = await params; // Get the student ID from URL

  try {
    await connectToDatabase(); // Connect to DB

    // Delete the student and return the deleted document
    const student = await Student.findByIdAndDelete(id);

    // If nothing was deleted → ID didn't match any document
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Success: student deleted
    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error);

    // Handle invalid ID or server issues
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 } // Internal Server Error
    );
  }
}