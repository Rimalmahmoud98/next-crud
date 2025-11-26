import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Student from '@/models/Student';

/**
 * GET /api/students/search?q=john
 * GET /api/students/search?q=john@gmail.com
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q')?.trim();

        // If no query or empty, return empty array
        if (!q || q.length < 1) {
            return NextResponse.json([]);
        }

        await connectToDatabase();

        // Case-insensitive partial match on name OR email
        const regex = new RegExp(q, 'i');

        const students = await Student.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        })
            .select('name age email')  // only return needed fields
            .sort({ name: 1 })
            .limit(50); // safety limit

        return NextResponse.json(students);

    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to search students' },
            { status: 500 }
        );
    }
}