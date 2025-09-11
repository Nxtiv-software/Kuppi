// src/components/students-dashboard/VoteCreate.jsx
import React, { useState } from 'react';
import styles from './VoteCreate.module.css';
import { createPoll, getTrendingPolls, getPolls, voteOnPoll, removeVote, deletePoll } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

const CreatePoll = ({ onBack }) => {
  const queryClient = useQueryClient();
  // AUTHENTICATION: Use real authentication
  const { user, isSignedIn } = useUser();

  const [pollData, setPollData] = useState({
    title: '',
    subject: '',
    chapter: '',
    description: '',
    preferredDate: '',
    timeSlot: '',
    maxStudents: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // AUTHENTICATION: Check if user is signed in
    if (!isSignedIn || !user) {
      toast.error('Please sign in to create a poll');
      return;
    }

    // Validation
    if (!pollData.title || !pollData.subject || !pollData.chapter || !pollData.description || 
        !pollData.preferredDate || !pollData.timeSlot || !pollData.maxStudents) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Title validation (server requires 5-200 characters)
    if (pollData.title.length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }

    if (pollData.title.length > 200) {
      toast.error('Title must be less than 200 characters');
      return;
    }

    // Description validation (server requires 10-1000 characters)
    if (pollData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    if (pollData.description.length > 1000) {
      toast.error('Description must be less than 1000 characters');
      return;
    }

    // Chapter validation
    if (pollData.chapter.length < 3) {
      toast.error('Chapter/Topic must be at least 3 characters long');
      return;
    }

    if (parseInt(pollData.maxStudents) < 1 || parseInt(pollData.maxStudents) > 50) {
      toast.error('Max students must be between 1 and 50');
      return;
    }

    const selectedDate = new Date(pollData.preferredDate);
    if (selectedDate <= new Date()) {
      toast.error('Preferred date must be in the future');
      return;
    }

    setIsSubmitting(true);
    try {
      // Add user information to the poll data
      const pollDataWithUser = {
        ...pollData,
        maxStudents: parseInt(pollData.maxStudents), // Convert to number
        createdBy: user.id,
        creatorName: user.name || user.firstName || 'Anonymous'
      };
      
      await createPoll(pollDataWithUser);
      toast.success('Poll created successfully!');
      onBack();
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
      
      // Reset form
      setPollData({
        title: '',
        subject: '',
        chapter: '',
        description: '',
        preferredDate: '',
        timeSlot: '',
        maxStudents: '',
      });
    } catch (error) {
      toast.error(error.message);
      console.error('Error creating poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createPoll}>
      <div className={styles.formHeader}>
        <button onClick={onBack} className={styles.backButton} type="button">← Back</button>
        <h2 className={styles.formTitle}>Create New Poll</h2>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.pollForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Poll Title * (5-200 characters)</label>
            <input
              type="text"
              value={pollData.title}
              onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
              className={styles.input}
              placeholder="e.g., combined mathematics revision session (minimum 2 characters)"
              minLength="2"
              maxLength="200"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subject *</label>
            <select
              value={pollData.subject}
              onChange={(e) => setPollData({ ...pollData, subject: e.target.value })}
              className={styles.select}
              required
            >
              <option value="">Select Subject</option>
              <option value="combined-maths">Combined Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chapter/Topic * (minimum 3 characters)</label>
            <input
              type="text"
              value={pollData.chapter}
              onChange={(e) => setPollData({ ...pollData, chapter: e.target.value })}
              className={styles.input}
              placeholder="e.g., introduction to integration (minimum 3 characters)"
              minLength="3"
              maxLength="200"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Preferred Date *</label>
            <input
              type="date"
              value={pollData.preferredDate}
              onChange={(e) => setPollData({ ...pollData, preferredDate: e.target.value })}
              className={styles.input}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Slot *</label>
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
            <label className={styles.label}>Max Students *</label>
            <input
              type="number"
              value={pollData.maxStudents}
              onChange={(e) => setPollData({ ...pollData, maxStudents: e.target.value })}
              className={styles.input}
              min="1"
              max="50"
              placeholder="e.g., 2"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description * (10-1000 characters)</label>
          <textarea
            value={pollData.description}
            onChange={(e) => setPollData({ ...pollData, description: e.target.value })}
            className={styles.textarea}
            placeholder="Describe what topics will be covered and any special requirements... (minimum 10 characters)"
            minLength="10"
            maxLength="1000"
            rows="4"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={onBack}>
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </button>
        </div>
      </form>
    </div>
  );
};

const FilterPolls = () => {
  // AUTHENTICATION: Use real authentication
  const { user, isSignedIn } = useUser();

  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all',
    date: 'all',
    page: 1,
    limit: 10
  });

  const { data: polls, isLoading, error } = useQuery({
    queryKey: ['polls', filters],
    queryFn: () => getPolls(filters),
    enabled: isSignedIn, // Only fetch when user is signed in
    staleTime: 2 * 60 * 1000, // 2 minutes - polls don't change very frequently
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic polling
  });

  const handleVote = async (pollId) => {
    // AUTHENTICATION: Check if user is signed in
    if (!isSignedIn || !user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      await voteOnPoll(pollId);
      toast.success('Vote recorded successfully!');
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      console.error('Error voting on poll:', error);
      toast.error(error.message || 'Failed to vote on poll');
    }
  };

  const handleRemoveVote = async (pollId) => {
    // AUTHENTICATION: Check if user is signed in
    if (!isSignedIn || !user) {
      toast.error('Please sign in to remove vote');
      return;
    }

    try {
      console.log('Remove vote attempt:', { 
        pollId, 
        userId: user.id, 
        userName: user.fullName || user.firstName || 'Unknown',
        isSignedIn 
      });
      
      await removeVote(pollId);
      toast.success('Vote removed successfully!');
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      console.error('Error removing vote:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.message || 'Failed to remove vote');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) {
      return;
    }

    try {
      await deletePoll(pollId);
      toast.success('Poll deleted successfully!');
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      toast.error(error.message);
      console.error('Error deleting poll:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSubjectDisplayName = (subject) => {
    const subjectMap = {
      'combined-maths': 'Combined Mathematics',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
    };
    return subjectMap[subject] || subject;
  };

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className={styles.signInPrompt}>
        <h3>Please sign in to view and vote on polls</h3>
      </div>
    );
  }

  return (
    <div className={styles.filterPolls}>
      <h3 className={styles.filterHeader}>Filter Polls</h3>
      <div className={styles.filterForm}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Subject</label>
          <select 
            className={styles.select}
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="combined-maths">Combined Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Status</label>
          <select 
            className={styles.select}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Date</label>
          <select 
            className={styles.select}
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>
      
      <div className={styles.pollsGrid}>
        {isLoading && <div className={styles.loading}>Loading polls...</div>}
        {error && <div className={styles.error}>Error loading polls: {error.message}</div>}
        {polls && polls.data && polls.data.polls.length === 0 && (
          <div className={styles.noPollsMessage}>No polls found with current filters.</div>
        )}
        {polls && polls.data && polls.data.polls.map((poll) => {
          const hasVoted = poll.hasVoted;
          
          // Debug: Log complete poll data to see available user fields
          console.log('🔍 Complete Poll Data Analysis:', {
            pollId: poll._id,
            pollTitle: poll.title,
            hasVoted,
            currentUserId: user?.id,
            pollCreator: poll.createdBy,
            voteCount: poll.voteCount,
            pollStatus: poll.status,
            // Check all possible creator fields
            creatorField: poll.creator,
            creatorInfoField: poll.creatorInfo,
            creatorNameField: poll.creatorName,
            // Complete poll object for analysis
            fullPoll: poll
          });
          
          // Debug: Check what creator data is available
          console.log('👤 Creator Data Available:', {
            'poll.creator': poll.creator,
            'poll.creatorInfo': poll.creatorInfo,
            'poll.creatorName': poll.creatorName,
            'poll.createdBy': poll.createdBy
          });
          
          return (
            <div key={poll._id} className={styles.pollCard}>
              <div className={styles.pollHeader}>
                <h4 className={styles.pollTitle}>{poll.title}</h4>
                <span className={`${styles.pollStatus} ${styles[poll.status]}`}>
                  {poll.status}
                </span>
              </div>
              <div className={styles.pollInfo}>
                <p className={styles.pollSubject}>{getSubjectDisplayName(poll.subject)}</p>
                <p className={styles.pollChapter}>{poll.chapter}</p>
                <p className={styles.pollCreator}>
                  Created by {
                    // Try multiple possible creator fields in order of preference
                    poll.creatorInfo?.name || 
                    poll.creatorInfo?.firstName || 
                    poll.creatorName || 
                    poll.creator?.name || 
                    poll.creator?.firstName ||
                    'Unknown'
                  }
                </p>
                <p className={styles.pollDate}>Preferred: {formatDate(poll.preferredDate)}</p>
                <p className={styles.pollTimeSlot}>Time: {poll.timeSlot}</p>
              </div>
              <div className={styles.pollDescription}>
                <p>{poll.description}</p>
              </div>
              <div className={styles.pollProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${Math.min((poll.voteCount / poll.maxStudents) * 100, 100)}%` }}
                  />
                </div>
                <div className={styles.progressText}>
                  {poll.voteCount}/{poll.maxStudents} votes
                </div>
              </div>
              <div className={styles.pollFooter}>
                <div className={styles.pollActions}>
                  {poll.status === 'active' && (
                    <>
                      {!hasVoted ? (
                        <button 
                          className={styles.voteButton} 
                          onClick={() => handleVote(poll._id)}
                          disabled={!isSignedIn}
                          title={!isSignedIn ? "Please sign in to vote" : "Vote for this poll"}
                        >
                          {isSignedIn ? 'Vote Now' : 'Sign In to Vote'}
                        </button>
                      ) : (
                        <button 
                          className={styles.removeVoteButton} 
                          onClick={() => handleRemoveVote(poll._id)}
                          disabled={!isSignedIn}
                          title={!isSignedIn ? "Please sign in to remove vote" : "Remove your vote"}
                        >
                          Remove Vote
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Allow creator to delete poll if vote count <= 3 and poll is active */}
                  {user && poll.createdBy === user.id && 
                   poll.voteCount <= 3 && poll.status === 'active' && (
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDeletePoll(poll._id)}
                    >
                      Delete
                    </button>
                  )}
                  
                  {/* Show info for polls that can't be deleted */}
                  {user && poll.createdBy === user.id && 
                   poll.voteCount > 3 && poll.status === 'active' && (
                    <button 
                      className={styles.deleteButton}
                      style={{opacity: 0.5, cursor: 'not-allowed'}}
                      onClick={() => toast.info(`Cannot delete: Poll has ${poll.voteCount} votes. Can only delete polls with 3 or fewer votes.`)}
                    >
                      Delete (Disabled)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {polls && polls.data && polls.data.pagination && polls.data.pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton}
            onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
            disabled={filters.page <= 1}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {polls.data.pagination.current} of {polls.data.pagination.pages}
          </span>
          <button 
            className={styles.paginationButton}
            onClick={() => handleFilterChange('page', Math.min(polls.data.pagination.pages, filters.page + 1))}
            disabled={filters.page >= polls.data.pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const TrendingPolls = () => {
  // AUTHENTICATION: Use real authentication
  const { user, isSignedIn } = useUser();

  const queryClient = useQueryClient();
  const { data: trendingPolls, isLoading, error } = useQuery({
    queryKey: ['trendingPolls'],
    queryFn: getTrendingPolls,
    enabled: isSignedIn, // Only fetch when user is signed in
    staleTime: 5 * 60 * 1000, // 5 minutes - trending polls change slowly
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic polling
  });

  const handleVote = async (pollId) => {
    // AUTHENTICATION: Check if user is signed in
    if (!isSignedIn || !user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      console.log('Trending poll voting attempt:', { 
        pollId, 
        userId: user.id, 
        userName: user.fullName || user.firstName || 'Unknown',
        isSignedIn 
      });
      
      await voteOnPoll(pollId);
      toast.success('Vote recorded successfully!');
      queryClient.invalidateQueries(['trendingPolls']);
      queryClient.invalidateQueries(['polls']);
    } catch (error) {
      console.error('Error voting on trending poll:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.message || 'Failed to vote on poll');
    }
  };

  const handleRemoveVote = async (pollId) => {
    // AUTHENTICATION: Check if user is signed in
    if (!isSignedIn || !user) {
      toast.error('Please sign in to remove vote');
      return;
    }

    try {
      console.log('Trending poll remove vote attempt:', { 
        pollId, 
        userId: user.id, 
        userName: user.fullName || user.firstName || 'Unknown',
        isSignedIn 
      });
      
      await removeVote(pollId);
      toast.success('Vote removed successfully!');
      queryClient.invalidateQueries(['trendingPolls']);
      queryClient.invalidateQueries(['polls']);
    } catch (error) {
      console.error('Error removing vote from trending poll:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.message || 'Failed to remove vote');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSubjectDisplayName = (subject) => {
    const subjectMap = {
      'combined-maths': 'Combined Mathematics',
      'physics': 'Physics',
      'chemistry': 'Chemistry'
    };
    return subjectMap[subject] || subject;
  };

  return (
    <div className={styles.trendingPolls}>
      <h3 className={styles.sectionTitle}>🔥 Trending Polls (7+ votes)</h3>
      <div className={styles.pollsGrid}>
        {isLoading && <div className={styles.loading}>Loading trending polls...</div>}
        {error && <div className={styles.error}>Error loading trending polls: {error.message}</div>}
        {trendingPolls && trendingPolls.data && trendingPolls.data.length === 0 && (
          <div className={styles.noTrendingMessage}>No trending polls yet. Vote on polls to make them trend!</div>
        )}
        {trendingPolls && trendingPolls.data && trendingPolls.data.map((poll) => {
          const hasVoted = poll.hasVoted;
          
          // Debug: Log complete trending poll data to see available user fields
          console.log('🔥 Complete Trending Poll Data Analysis:', {
            pollId: poll._id,
            pollTitle: poll.title,
            hasVoted,
            currentUserId: user?.id,
            pollCreator: poll.createdBy,
            voteCount: poll.voteCount,
            pollStatus: poll.status,
            // Check all possible creator fields
            creatorField: poll.creator,
            creatorInfoField: poll.creatorInfo,
            creatorNameField: poll.creatorName,
            // Complete poll object for analysis
            fullPoll: poll
          });
          
          // Debug: Check what creator data is available
          console.log('👤 Trending Poll Creator Data Available:', {
            'poll.creator': poll.creator,
            'poll.creatorInfo': poll.creatorInfo,
            'poll.creatorName': poll.creatorName,
            'poll.createdBy': poll.createdBy
          });
          
          return (
            <div key={poll._id} className={`${styles.pollCard} ${styles.trendingCard}`}>
              <div className={styles.pollHeader}>
                <h4 className={styles.pollTitle}>{poll.title}</h4>
                <div className={styles.badgeContainer}>
                  <span className={`${styles.pollStatus} ${styles[poll.status]}`}>
                    {poll.status}
                  </span>
                  <span className={styles.trendingBadge}>🔥 Trending</span>
                </div>
              </div>
              <div className={styles.pollInfo}>
                <p className={styles.pollSubject}>{getSubjectDisplayName(poll.subject)}</p>
                <p className={styles.pollChapter}>{poll.chapter}</p>
                <p className={styles.pollCreator}>
                  Created by {
                    // Try multiple possible creator fields in order of preference
                    poll.creatorInfo?.name || 
                    poll.creatorInfo?.firstName || 
                    poll.creatorName || 
                    poll.creator?.name || 
                    poll.creator?.firstName ||
                    'Unknown'
                  }
                </p>
                <p className={styles.pollDate}>Preferred: {formatDate(poll.preferredDate)}</p>
                <p className={styles.pollTimeSlot}>Time: {poll.timeSlot}</p>
              </div>
              <div className={styles.pollDescription}>
                <p>{poll.description}</p>
              </div>
              <div className={styles.pollProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${Math.min((poll.voteCount / poll.maxStudents) * 100, 100)}%` }}
                  />
                </div>
                <div className={styles.progressText}>
                  {poll.voteCount}/{poll.maxStudents} votes
                </div>
              </div>
              <div className={styles.pollFooter}>
                <div className={styles.pollActions}>
                  {poll.status === 'active' && (
                    <>
                      {!hasVoted ? (
                        <button 
                          className={styles.voteButton} 
                          onClick={() => handleVote(poll._id)}
                          disabled={!isSignedIn}
                          title={!isSignedIn ? "Please sign in to vote" : "Vote for this poll"}
                        >
                          {isSignedIn ? 'Vote Now' : 'Sign In to Vote'}
                        </button>
                      ) : (
                        <button 
                          className={styles.removeVoteButton} 
                          onClick={() => handleRemoveVote(poll._id)}
                          disabled={!isSignedIn}
                          title={!isSignedIn ? "Please sign in to remove vote" : "Remove your vote"}
                        >
                          Remove Vote
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VoteCreate = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  // AUTHENTICATION: Use real authentication  
  const { isSignedIn } = useUser();

  return (
    <div className={styles.voteCreate}>
      {!showCreateForm ? (
        <>
          <div className={styles.header}>
            <button 
              className={styles.createButton}
              onClick={() => setShowCreateForm(true)}
              disabled={!isSignedIn}
              title={!isSignedIn ? "Please sign in to create polls" : "Create a new poll"}
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
