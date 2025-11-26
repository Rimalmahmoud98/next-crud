// Main page component for the Student Management System
// This is a Client Component because we need to coordinate state between
// the Add/Edit form and the list (to trigger refresh after save)

'use client';  // Marks this file as a Client Component
               // Required because we use useState and pass functions as props

import { useState } from 'react';                    // React hook to manage local component state
import StudentForm from '@/components/StudentForm';   // Form component for adding/editing students
import StudentList from '@/components/StudentList';   // List component that displays all students

// Default export — this becomes the page at /students
export default function StudentsPage() {

  // State to hold the refresh function provided by StudentList
  // Initially null → no refresh function available yet
  // We store the actual fetch function from StudentList so StudentForm can call it
  const [refreshFn, setRefreshFn] = useState(null);

  return (
    // Main container with responsive, clean styling
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',           // Centers the content horizontally
      fontFamily: 'sans-serif'    // Clean, readable default font
    }}>
      
      {/* Page title — visually prominent and centered */}
      <h1 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        Student Management System
      </h1>

      {/* 
        StudentForm receives the refresh function 
        So after a successful add/edit, it can trigger list reload 
      */}
      <StudentForm fetchStudents={refreshFn} />

      {/* Visual separator between form and list */}
      <hr style={{
        margin: '3rem 0',
        border: '1px solid #eee',
        opacity: 0.6
      }} />

      {/* 
        StudentList is responsible for loading data
        When it mounts and creates its fetchStudents function,
        it calls onLoaded and passes that function up to the parent
        We capture it here using setRefreshFn
      */}
      <StudentList 
        onLoaded={(fn) => setRefreshFn(() => fn)} 
      />
      
    </div>
  );
}