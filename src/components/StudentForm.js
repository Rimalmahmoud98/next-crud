// Reusable form component for both Adding and Editing students
// Works with REST API (POST / PUT) and triggers list refresh via callback

'use client'; // This is a Client Component — required for useState, useEffect, and form interaction

import { useState, useEffect } from 'react'; // React hooks for state and side effects

// Props:
// - studentToEdit: object (if editing) or null/undefined (if adding)
// - onClose: callback to close modal (used only in edit mode)
// - onSaved: optional callback (not used here, but kept for flexibility)
// - fetchStudents: function from StudentList to refresh the list after save
export default function StudentForm({ studentToEdit, onClose, onSaved, fetchStudents }) {
  // Detect if we're in "edit" mode (studentToEdit exists)
  const isEdit = !!studentToEdit;

  // Local form state — holds current input values
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });

  // Loading state to disable button and show feedback during API call
  const [loading, setLoading] = useState(false);

  // When studentToEdit changes (e.g., user clicks "Edit"), pre-fill the form
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',     // Safely extract name
        age: studentToEdit.age || '',       // Age comes as number from DB
        email: studentToEdit.email || '',   // Email is string
      });
    }
  }, [studentToEdit]); // Re-run when a different student is selected for editing

  // Generic input change handler — updates state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submit handler — handles both Add (POST) and Edit (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();           // Prevent page reload
    setLoading(true);             // Show loading state

    // Determine API endpoint and HTTP method based on mode
    const url = isEdit 
      ? `/api/students/${studentToEdit._id}` 
      : '/api/students';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      // Send request to our REST API
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10), // Convert age string → number
        }),
      });

      // Success path
      if (res.ok) {
        // Reset form to blank (only matters for "Add" mode)
        setFormData({ name: '', age: '', email: '' });

        // Close edit modal (if in edit mode)
        onClose?.();

        // Trigger list refresh so new/updated student appears immediately
        fetchStudents?.();

        // Optional: trigger legacy callback if parent uses it
        onSaved?.();

        // Debug confirmation
        console.log("Student saved successfully!!");
      } 
      // Error path — API returned error status
      else {
        const err = await res.json();
        alert(err.error || 'Failed to save student');
      }
    } 
    // Network or JSON parsing errors
    catch (err) {
      console.error('Form submit error:', err);
      alert('Network error — check your connection');
    } 
    // Always runs — re-enable button
    finally {
      setLoading(false);
    }
  };

  // Render the form UI
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      maxWidth: '500px',
      margin: '2rem auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Dynamic title based on mode */}
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        {isEdit ? 'Edit Student' : 'Add New Student'}
      </h2>

      {/* HTML form — submits via handleSubmit */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />

        {/* Button row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: loading ? '#999' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
          </button>

          {/* Cancel button only shown in edit mode */}
          {isEdit && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 20px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}