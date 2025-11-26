// Client-side component that displays the list of students
// Handles loading, editing (via modal), deleting, and refresh coordination

'use client'; // Required: uses useState, useEffect, and event handlers

import { useEffect, useState } from 'react';     // React hooks for state and lifecycle
import StudentForm from './StudentForm';         // Reusable form for add/edit (used in modal)

// Props:
// - onLoaded: callback function to pass the fetchStudents() function up to parent
//             This allows StudentForm (or parent) to trigger a refresh after save
export default function StudentList({ onLoaded }) {
  // State: array of students from the database
  const [students, setStudents] = useState([]);

  // State: controls initial loading spinner
  const [loading, setLoading] = useState(true);

  // State: holds the student currently being edited (null = no modal)
  const [editingStudent, setEditingStudent] = useState(null);

  // Core function: fetches all students from our REST API
  // This function is shared with parent and StudentForm for manual refresh
  const fetchStudents = async () => {
    console.log("Fetching students..."); // Debug log — useful during dev
    try {
      // Call our GET /api/students endpoint
      const res = await fetch('/api/students');

      // Parse JSON response
      const data = await res.json();

      // Update state with fresh data
      setStudents(data);

      // Important: Pass this exact function reference up to parent
      // So it can be called later from StudentForm after add/edit
      onLoaded?.(fetchStudents);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      // Optionally show user-facing error here
    } finally {
      // Always hide loading spinner
      setLoading(false);
    }
  };

  // On component mount: fetch students once
  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array → runs only once on mount

  // Delete handler — removes student and refreshes list
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      // Refresh list immediately after successful delete
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  // Show loading message while fetching initial data
  if (loading) {
    return <p>Loading students...</p>;
  }

  return (
    <div>
      {/* Header with student count */}
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.8rem' }}>
        All Students ({students.length})
      </h2>

      {/* Edit Modal — appears when editingStudent is not null */}
      {editingStudent && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)' // Optional: nice visual effect
          }}
          onClick={() => setEditingStudent(null)} // Click outside → close
        >
          {/* Prevent click from bubbling up and closing modal */}
          <div onClick={(e) => e.stopPropagation()}>
            <StudentForm
              studentToEdit={editingStudent}
              onClose={() => setEditingStudent(null)}
              fetchStudents={fetchStudents} // Critical: pass refresh function
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {students.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No students yet. Add one above!
        </p>
      ) : (
        /* Student list */
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {students.map((student) => (
            <li
              key={student._id} // Important: unique key for React reconciliation
              style={{
                padding: '18px',
                marginBottom: '12px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Student info */}
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{student.name}</strong>
                <span style={{ color: '#666', marginLeft: '8px' }}>
                  ({student.age} years old)
                </span>
                <br />
                <small style={{ color: '#888' }}>{student.email}</small>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setEditingStudent(student)}
                  style={{
                    padding: '10px 16px',
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  style={{
                    padding: '10px 16px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}