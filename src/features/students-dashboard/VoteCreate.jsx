// src/components/students-dashboard/VoteCreate.jsx
import React, { useState, useEffect } from 'react';
import styles from './VoteCreate.module.css';
import { createPoll, getTrendingPolls, getPolls, voteOnPoll, removeVote } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CreatePoll = ({ onBack }) => {
  const { user } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to create a poll');
      return;
    }

    try {
      await createPoll(pollData);
      toast.success('Poll created successfully!');
      onBack();
      queryClient.refetchQueries(['polls']);
    } catch (error) {
      toast.error(error.message);
    }
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
              onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
              className={styles.input}
              placeholder="e.g., Data Structures Revision Session"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subject</label>
            <select
              value={pollData.subject}
              onChange={(e) => setPollData({ ...pollData, subject: e.target.value })}
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
              onChange={(e) => setPollData({ ...pollData, chapter: e.target.value })}
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
              onChange={(e) => setPollData({ ...pollData, preferredDate: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Slot</label>
            <select
              value={pollData.timeSlot}
              onChange={(e) => setPollData({ ...pollData, timeSlot: e.target.value })}
              className={styles.select}
              required
            >
              <option value="">Select Time Slot</option>
              <option value="morning">Morning (8AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 4PM)</option>
              <option value="evening">Evening (4PM - 8PM)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Max Students</label>
            <input
              type="number"
              value={pollData.maxStudents}
              onChange={(e) => setPollData({ ...pollData, maxStudents: e.target.value })}
              className={styles.input}
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
            onChange={(e) => setPollData({ ...pollData, description: e.target.value })}
            className={styles.textarea}
            placeholder="e.g., Need help with binary tree traversal concepts"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={onBack}>Cancel</button>
          <button type="submit" className={styles.submitButton}>Create Poll</button>
        </div>
      </form>
    </div>
  );
};

const FilterPolls = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: polls, isLoading, error } = useQuery({
    queryKey: ['polls'],
    queryFn: () => getPolls({ page: 1, limit: 10 }),
  });

  const handleVote = async (pollId) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      await voteOnPoll(pollId);
      toast.success('Vote recorded successfully!');
      queryClient.refetchQueries(['polls']);
      queryClient.refetchQueries(['trendingPolls']);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveVote = async (pollId) => {
    if (!user) {
      toast.error('Please log in to remove vote');
      return;
    }
    try {
      await removeVote(pollId);
      toast.success('Vote removed successfully!');
      queryClient.refetchQueries(['polls']);
      queryClient.refetchQueries(['trendingPolls']);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.filterPolls}>
      <h3 className={styles.filterHeader}>Filter Polls</h3>
      <div className={styles.filterForm}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Subject</label>
          <select className={styles.select}>
            <option value="all">All Subjects</option>
            <option value="data-structures">Data Structures</option>
            <option value="algorithms">Algorithms</option>
            <option value="database">Database Systems</option>
            <option value="web-dev">Web Development</option>
            <option value="mobile-dev">Mobile Development</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Status</label>
          <select className={styles.select}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Date</label>
          <select className={styles.select}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>
      <div className={styles.pollsGrid}>
        {isLoading && <p>Loading polls...</p>}
        {error && <p>Error loading polls: {error.message}</p>}
        {polls && polls.data && polls.data.polls.map((poll) => (
          <div key={poll._id} className={styles.pollCard}>
            <div className={styles.pollHeader}>
              <h4 className={styles.pollTitle}>{poll.title}</h4>
              <span className={styles.pollStatus}>{poll.status}</span>
            </div>
            <div className={styles.pollInfo}>
              <p className={styles.pollSubject}>{poll.subject}</p>
              <p className={styles.pollChapter}>{poll.chapter}</p>
              <p className={styles.pollCreator}>Created by {poll.creator.name}</p>
            </div>
            <div className={styles.pollProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(poll.voteCount / poll.maxStudents) * 100}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {poll.voteCount}/{poll.maxStudents} votes
              </div>
            </div>
            <div className={styles.pollFooter}>
              <span className={styles.timeLeft}>⏰ Time Left: {poll.timeLeft || 'N/A'}</span>
              {!poll.hasVoted && (
                <button className={styles.voteButton} onClick={() => handleVote(poll._id)}>Vote Now</button>
              )}
              {poll.hasVoted && user && poll.creator._id === user._id && (
                <button className={styles.removeVoteButton} onClick={() => handleRemoveVote(poll._id)}>Remove Vote</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingPolls = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: trendingPolls, isLoading, error } = useQuery({
    queryKey: ['trendingPolls'],
    queryFn: getTrendingPolls,
  });

  const handleVote = async (pollId) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      await voteOnPoll(pollId);
      toast.success('Vote recorded successfully!');
      queryClient.refetchQueries(['trendingPolls']);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveVote = async (pollId) => {
    if (!user) {
      toast.error('Please log in to remove vote');
      return;
    }
    try {
      await removeVote(pollId);
      toast.success('Vote removed successfully!');
      queryClient.refetchQueries(['trendingPolls']);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.trendingPolls}>
      <h3 className={styles.sectionTitle}>Trending Polls</h3>
      <div className={styles.pollsGrid}>
        {isLoading && <p>Loading trending polls...</p>}
        {error && <p>Error loading trending polls: {error.message}</p>}
        {trendingPolls && trendingPolls.data && trendingPolls.data.map((poll) => (
          <div key={poll._id} className={styles.pollCard}>
            <div className={styles.pollHeader}>
              <h4 className={styles.pollTitle}>{poll.title}</h4>
              <span className={styles.pollStatus}>{poll.status}</span>
            </div>
            <div className={styles.pollInfo}>
              <p className={styles.pollSubject}>{poll.subject}</p>
              <p className={styles.pollChapter}>{poll.chapter}</p>
              <p className={styles.pollCreator}>Created by {poll.creator.name}</p>
            </div>
            <div className={styles.pollProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(poll.voteCount / poll.maxStudents) * 100}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {poll.voteCount}/{poll.maxStudents} votes
              </div>
            </div>
            <div className={styles.pollFooter}>
              <span className={styles.timeLeft}>⏰ Time Left: {poll.timeLeft || 'N/A'}</span>
              {!poll.hasVoted && (
                <button className={styles.voteButton} onClick={() => handleVote(poll._id)}>Vote Now</button>
              )}
              {poll.hasVoted && user && poll.creator._id === user._id && (
                <button className={styles.removeVoteButton} onClick={() => handleRemoveVote(poll._id)}>Remove Vote</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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