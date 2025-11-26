import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Instructor from '@/models/Instructor';

// GET: Fetch all Instructors
export async function GET() {
    try {
        await connectToDatabase();
        const instructors = await Instructor.find({}).sort({ createdAt: -1 });
        return NextResponse.json(instructors);
    } catch (error) {
        console.error('GET /api/instructors error:', error);
        return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
    }
}

// POST: Create new instructor
export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const { name, age, email } = body;

        if (!name || !age || !email) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const instructor = new Instructor({ name, age, email });
        await instructor.save();

        return NextResponse.json(instructor, { status: 201 });
    } catch (error) {
        console.error('POST /api/instructors error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
    }
}