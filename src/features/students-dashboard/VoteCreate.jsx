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

// Filter Polls Component
const FilterPolls = () => {
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all',
    date: 'all'
  });

  return (
    <div className={styles.filterPolls}>
      <h3 className={styles.filterTitle}>Filter Polls</h3>
      <div className={styles.filtersRow}>
        <select
          value={filters.subject}
          onChange={(e) => setFilters({...filters, subject: e.target.value})}
          className={styles.filterSelect}
        >
          <option value="all">All Subjects</option>
          <option value="data-structures">Data Structures</option>
          <option value="algorithms">Algorithms</option>
          <option value="database">Database Systems</option>
          <option value="web-dev">Web Development</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <select
          value={filters.date}
          onChange={(e) => setFilters({...filters, date: e.target.value})}
          className={styles.filterSelect}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
};

// Trending Polls Component
const TrendingPolls = () => {
  const polls = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      subject: 'Web Development',
      chapter: 'useState, useEffect, Custom Hooks',
      votes: 24,
      targetVotes: 30,
      timeLeft: '2 days',
      status: 'active',
      creator: 'Sarah K.'
    },
    {
      id: 2,
      title: 'Database Normalization',
      subject: 'Database Systems',
      chapter: '1NF, 2NF, 3NF Forms',
      votes: 18,
      targetVotes: 25,
      timeLeft: '4 days',
      status: 'active',
      creator: 'Mike R.'
    },
    {
      id: 3,
      title: 'Sorting Algorithms',
      subject: 'Data Structures',
      chapter: 'Quick Sort, Merge Sort, Heap Sort',
      votes: 15,
      targetVotes: 20,
      timeLeft: '1 day',
      status: 'active',
      creator: 'Alex M.'
    }
  ];

  return (
    <div className={styles.trendingPolls}>
      <h3 className={styles.sectionTitle}>Trending Polls</h3>
      <div className={styles.pollsGrid}>
        {polls.map((poll) => (
          <div key={poll.id} className={styles.pollCard}>
            <div className={styles.pollHeader}>
              <h4 className={styles.pollTitle}>{poll.title}</h4>
              <span className={styles.pollStatus}>{poll.status}</span>
            </div>
            
            <div className={styles.pollInfo}>
              <p className={styles.pollSubject}>{poll.subject}</p>
              <p className={styles.pollChapter}>{poll.chapter}</p>
              <p className={styles.pollCreator}>Created by {poll.creator}</p>
            </div>

            <div className={styles.pollProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(poll.votes / poll.targetVotes) * 100}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {poll.votes}/{poll.targetVotes} votes
              </div>
            </div>

            <div className={styles.pollFooter}>
              <span className={styles.timeLeft}>⏰ {poll.timeLeft} left</span>
              <button className={styles.voteButton}>Vote Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Vote Create Component
const VoteCreate = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className={styles.voteCreate}>
      {!showCreateForm ? (
        <>
          <div className={styles.header}>
            <button 
              className={styles.createButton}
              onClick={() => setShowCreateForm(true)}
            >
              + Create New Poll
            </button>
          </div>
          <FilterPolls />
          <TrendingPolls />
        </>
      ) : (
        <CreatePoll onBack={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default VoteCreate;