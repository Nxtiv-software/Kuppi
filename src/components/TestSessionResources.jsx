// Test component to verify session resources feature
import React, { useState } from 'react';
import { addMeetingLink, addSessionAttachment, addSessionAnnouncement } from '../services/api';

const TestSessionResources = () => {
  const [sessionId, setSessionId] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const testMeetingLink = async () => {
    try {
      const result = await addMeetingLink(sessionId, meetingLink);
      console.log('✅ Meeting link added:', result);
      alert('Meeting link added successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const testAttachment = async () => {
    try {
      const result = await addSessionAttachment(sessionId, file, description);
      console.log('✅ Attachment uploaded:', result);
      alert('Attachment uploaded successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const testAnnouncement = async () => {
    try {
      const result = await addSessionAnnouncement(sessionId, announcement);
      console.log('✅ Announcement posted:', result);
      alert('Announcement posted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Session Resources Testing</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Session ID:</label>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Enter session ID"
          style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
        />
      </div>

      <hr />

      <h3>🔗 Test Meeting Link</h3>
      <input
        type="url"
        value={meetingLink}
        onChange={(e) => setMeetingLink(e.target.value)}
        placeholder="https://zoom.us/j/123456789"
        style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
      />
      <button onClick={testMeetingLink} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Add Meeting Link
      </button>

      <hr />

      <h3>📎 Test Attachment</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="File description..."
        style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
      />
      <button onClick={testAttachment} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Upload Attachment
      </button>

      <hr />

      <h3>📢 Test Announcement</h3>
      <textarea
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        placeholder="Special announcement for students..."
        rows="3"
        style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
      />
      <button onClick={testAnnouncement} style={{ padding: '0.5rem 1rem' }}>
        Post Announcement
      </button>

      <hr />

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
        <h4>📋 Instructions:</h4>
        <ol>
          <li>Enter a valid session ID from your database</li>
          <li>Test each feature by filling the forms and clicking buttons</li>
          <li>Check browser console for detailed API responses</li>
          <li>Verify data appears in your database</li>
          <li>Test student view by refreshing MySessions component</li>
        </ol>
      </div>
    </div>
  );
};

export default TestSessionResources;
