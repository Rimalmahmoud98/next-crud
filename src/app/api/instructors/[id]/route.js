import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Instructor from '@/models/Instructor';

// GET one instructor
export async function GET(request, { params }) {
    const { id } = await params;

    try {
        await connectToDatabase();
        const instructor = await Instructor.findById(id);
        if (!instructor) {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }
        return NextResponse.json(instructor);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid ID or server error' }, { status: 400 });
    }
}

// PUT: Update instructor
export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        await connectToDatabase();
        const body = await request.json();

        const instructor = await Instructor.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!instructor) {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }

        return NextResponse.json(instructor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
    }
}

// DELETE: Remove instructor
export async function DELETE(request, { params }) {
    const { id } = await params;

    try {
        await connectToDatabase();

        const instructor = await Instructor.findByIdAndDelete(id);

        if (!instructor) {
            return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
