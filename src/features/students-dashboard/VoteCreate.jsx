import React, { useState } from 'react';
import styles from "../students-dashboard/VoteCreate.module.css";

// Create Poll Component
const CreatePoll = ({ onBack }) => {
  const [pollData, setPollData] = useState({
    title: '',
    subject: '',
    chapter: '',
    description: '',
    preferredDate: '',
    timeSlot: '',
    maxStudents: '',
    advancePayment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Poll created:', pollData);
    onBack();
  };

  return (
    <div className={styles.createPoll}>
      <div className={styles.formHeader}>
        <button onClick={onBack} className={styles.backButton}>← Back</button>
        <h2 className={styles.formTitle}>Create New Poll</h2>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.pollForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Poll Title</label>
            <input
              type="text"
              value={pollData.title}
              onChange={(e) => setPollData({...pollData, title: e.target.value})}
              className={styles.input}
              placeholder="e.g., Data Structures Revision Session"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subject</label>
            <select
              value={pollData.subject}
              onChange={(e) => setPollData({...pollData, subject: e.target.value})}
              className={styles.select}
              required
            >
              <option value="">Select Subject</option>
              <option value="data-structures">Data Structures</option>
              <option value="algorithms">Algorithms</option>
              <option value="database">Database Systems</option>
              <option value="web-dev">Web Development</option>
              <option value="mobile-dev">Mobile Development</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chapter/Topic</label>
            <input
              type="text"
              value={pollData.chapter}
              onChange={(e) => setPollData({...pollData, chapter: e.target.value})}
              className={styles.input}
              placeholder="e.g., Binary Trees and Traversal"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Preferred Date</label>
            <input
              type="date"
              value={pollData.preferredDate}
              onChange={(e) => setPollData({...pollData, preferredDate: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Slot</label>
            <select
              value={pollData.timeSlot}
              onChange={(e) => setPollData({...pollData, timeSlot: e.target.value})}
              className={styles.select}
              required
            >
              <option value="">Select Time</option>
              <option value="morning">Morning (8AM - 12PM)</option>
              <option value="afternoon">Afternoon (1PM - 5PM)</option>
              <option value="evening">Evening (6PM - 10PM)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Max Students</label>
            <input
              type="number"
              value={pollData.maxStudents}
              onChange={(e) => setPollData({...pollData, maxStudents: e.target.value})}
              className={styles.input}
              placeholder="e.g., 20"
              min="5"
              max="50"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            value={pollData.description}
            onChange={(e) => setPollData({...pollData, description: e.target.value})}
            className={styles.textarea}
            placeholder="Describe what topics will be covered and any special requirements..."
            rows="4"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onBack} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Create Poll
          </button>
        </div>
      </form>
    </div>
  );
};

