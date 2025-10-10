import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAvailableSessions, joinSession } from '../../services/api';
import { toast } from 'react-hot-toast';
import styles from "../students-dashboard/BrowseKuppi.module.css";
import img from "../../assets/images/img.png"

// Search Filters Component
const SearchFilters = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
  return (
    <div className={styles.searchFilters}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for subjects, topics, or instructors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>🔍</button>
      </div>
      
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Subject</label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
            className={styles.select}
          >
            <option value="all">All Subjects</option>
            <option value="combined-mathematics">Combined Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Level</label>
          <select
            value={filters.level}
            onChange={(e) => setFilters({...filters, level: e.target.value})}
            className={styles.select}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className={styles.select}
          >
            <option value="all">Any Price</option>
            <option value="0-200">Rs. 0 - 200</option>
            <option value="200-500">Rs. 200 - 500</option>
            <option value="500-1000">Rs. 500 - 1000</option>
            <option value="1000+">Rs. 1000+</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Date</label>
          <select
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
            className={styles.select}
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Kuppi Grid Component
const KuppiGrid = ({ filters, searchTerm }) => {
  const queryClient = useQueryClient();
  const [joinLoading, setJoinLoading] = useState({});

  // Build API filters
  const apiFilters = {
    subject: filters.subject !== 'all' ? filters.subject : undefined,
    level: filters.level !== 'all' ? filters.level : undefined,
    page: 1,
    limit: 20
  };

  // Fetch available sessions
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['availableSessions', apiFilters],
    queryFn: () => getAvailableSessions(apiFilters)
  });

  // Filter sessions based on search term and client-side filters
  const filteredSessions = sessions?.data?.sessions?.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = filters.priceRange === 'all' || 
      (filters.priceRange === '0-200' && session.price <= 200) ||
      (filters.priceRange === '200-500' && session.price > 200 && session.price <= 500) ||
      (filters.priceRange === '500-1000' && session.price > 500 && session.price <= 1000) ||
      (filters.priceRange === '1000+' && session.price > 1000);

    return matchesSearch && matchesPrice;
  }) || [];

  const handleJoinSession = async (sessionId) => {
    try {
      setJoinLoading(prev => ({ ...prev, [sessionId]: true }));
      await joinSession(sessionId);
      toast.success('Successfully joined the session!');
      
      // Refresh the data
      queryClient.invalidateQueries(['availableSessions']);
      queryClient.invalidateQueries(['myScheduledSessions']);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setJoinLoading(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.kuppiGrid}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading available sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.kuppiGrid}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Failed to load sessions</h3>
          <p className={styles.errorText}>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.kuppiGrid}>
      <div className={styles.resultsHeader}>
        <h3 className={styles.resultsTitle}>
          Available Sessions ({filteredSessions.length})
        </h3>
        <div className={styles.sortOptions}>
          <select className={styles.sortSelect}>
            <option value="date">Sort by Date</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>No sessions found</h3>
          <p className={styles.emptyText}>
            Try adjusting your filters or search terms to find more sessions.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSessions.map((session) => (
            <div key={session.id} className={styles.kuppiCard}>
              <div className={styles.cardImage}>
                <img src={img} alt={session.title} />
                <div className={styles.levelBadge}>
                  {session.level}
                </div>
                {session.isEnrolled && (
                  <div className={styles.enrolledBadge}>
                    Enrolled
                  </div>
                )}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>{session.title}</h4>
                  <div className={styles.rating}>
                    <span className={styles.ratingStars}>⭐</span>
                    <span className={styles.ratingValue}>{session.rating.toFixed(1)}</span>
                    <span className={styles.reviewCount}>({session.reviews})</span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <p className={styles.instructor}>by {session.instructor}</p>
                  <p className={styles.subject}>{session.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>

                <div className={styles.tags}>
                  {session.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                <p className={styles.description}>{session.description}</p>

                <div className={styles.sessionInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>📅</span>
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>⏰</span>
                    <span>{session.time} ({session.duration}h)</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.icon}>👥</span>
                    <span>{session.enrolled}/{session.maxStudents} enrolled</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.pricing}>
                    <span className={styles.currentPrice}>Rs. {session.price}</span>
                    <span className={styles.availableSpots}>
                      {session.availableSpots} spots left
                    </span>
                  </div>
                  <button 
                    className={`${styles.joinButton} ${session.isEnrolled ? styles.enrolledButton : ''}`}
                    onClick={() => !session.isEnrolled && handleJoinSession(session.id)}
                    disabled={session.isEnrolled || joinLoading[session.id] || session.availableSpots === 0}
                  >
                    {joinLoading[session.id] ? '...' : 
                     session.isEnrolled ? 'Enrolled' : 
                     session.availableSpots === 0 ? 'Full' : 'Join Session'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Browse Kuppis Component
const BrowseKuppis = () => {
  const [filters, setFilters] = useState({
    subject: 'all',
    level: 'all',
    priceRange: 'all',
    date: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.browseKuppis}>
      <div className={styles.header}>
        <h2 className={styles.title}>Browse Kuppis</h2>
        <p className={styles.subtitle}>Find and join available study sessions</p>
      </div>
      
      <SearchFilters 
        filters={filters} 
        setFilters={setFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <KuppiGrid filters={filters} searchTerm={searchTerm} />
    </div>
  );
};

export default BrowseKuppis;