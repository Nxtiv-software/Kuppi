import React, { useState } from 'react';
import styles from "../students-dashboard/BrowseKuppi.module.css";

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
            <option value="web-development">Web Development</option>
            <option value="data-structures">Data Structures</option>
            <option value="database">Database Systems</option>
            <option value="machine-learning">Machine Learning</option>
            <option value="mobile-development">Mobile Development</option>
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
  const allKuppis = [
    {
      id: 1,
      title: 'React Hooks Masterclass',
      subject: 'Web Development',
      instructor: 'John Smith',
      rating: 4.8,
      reviews: 124,
      price: 350,
      originalPrice: 500,
      date: 'Dec 28, 2024',
      time: '2:00 PM - 4:00 PM',
      enrolled: 15,
      maxStudents: 25,
      level: 'intermediate',
      tags: ['React', 'Hooks', 'JavaScript'],
      description: 'Deep dive into React Hooks with practical examples',
      image: 'https://via.placeholder.com/300x180?text=React+Hooks'
    },
    {
      id: 2,
      title: 'Database Design Fundamentals',
      subject: 'Database Systems',
      instructor: 'Dr. Sarah Wilson',
      rating: 4.9,
      reviews: 89,
      price: 400,
      originalPrice: 600,
      date: 'Dec 29, 2024',
      time: '10:00 AM - 12:00 PM',
      enrolled: 20,
      maxStudents: 30,
      level: 'beginner',
      tags: ['SQL', 'ERD', 'Normalization'],
      description: 'Learn database design principles and best practices',
      image: 'https://via.placeholder.com/300x180?text=Database+Design'
    },
    {
      id: 3,
      title: 'Machine Learning Basics',
      subject: 'Machine Learning',
      instructor: 'Prof. Mike Chen',
      rating: 4.7,
      reviews: 156,
      price: 600,
      originalPrice: 800,
      date: 'Dec 30, 2024',
      time: '7:00 PM - 9:00 PM',
      enrolled: 12,
      maxStudents: 20,
      level: 'intermediate',
      tags: ['Python', 'ML', 'Data Science'],
      description: 'Introduction to machine learning concepts and algorithms',
      image: 'https://via.placeholder.com/300x180?text=Machine+Learning'
    },
    {
      id: 4,
      title: 'Data Structures & Algorithms',
      subject: 'Data Structures',
      instructor: 'Alex Rodriguez',
      rating: 4.6,
      reviews: 203,
      price: 450,
      originalPrice: 650,
      date: 'Jan 2, 2025',
      time: '3:00 PM - 6:00 PM',
      enrolled: 25,
      maxStudents: 35,
      level: 'intermediate',
      tags: ['Algorithms', 'Data Structures', 'Problem Solving'],
      description: 'Comprehensive guide to data structures and algorithms',
      image: 'https://via.placeholder.com/300x180?text=Data+Structures'
    },
    {
      id: 5,
      title: 'Mobile App Development with React Native',
      subject: 'Mobile Development',
      instructor: 'Emma Johnson',
      rating: 4.5,
      reviews: 78,
      price: 550,
      originalPrice: 750,
      date: 'Jan 3, 2025',
      time: '6:00 PM - 8:30 PM',
      enrolled: 8,
      maxStudents: 15,
      level: 'advanced',
      tags: ['React Native', 'Mobile', 'JavaScript'],
      description: 'Build cross-platform mobile apps with React Native',
      image: 'https://via.placeholder.com/300x180?text=Mobile+Development'
    },
    {
      id: 6,
      title: 'Advanced CSS & Animations',
      subject: 'Web Development',
      instructor: 'David Kim',
      rating: 4.7,
      reviews: 145,
      price: 300,
      originalPrice: 450,
      date: 'Jan 4, 2025',
      time: '1:00 PM - 3:00 PM',
      enrolled: 18,
      maxStudents: 25,
      level: 'intermediate',
      tags: ['CSS', 'Animations', 'Web Design'],
      description: 'Master advanced CSS techniques and animations',
      image: 'https://via.placeholder.com/300x180?text=CSS+Animations'
    }
  ];

  // Filter kuppis based on filters and search term
  const filteredKuppis = allKuppis.filter(kuppi => {
    const matchesSearch = searchTerm === '' || 
      kuppi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kuppi.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kuppi.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = filters.subject === 'all' || 
      kuppi.subject.toLowerCase().replace(/\s+/g, '-') === filters.subject;

    const matchesLevel = filters.level === 'all' || kuppi.level === filters.level;

    const matchesPrice = filters.priceRange === 'all' || 
      (filters.priceRange === '0-200' && kuppi.price <= 200) ||
      (filters.priceRange === '200-500' && kuppi.price > 200 && kuppi.price <= 500) ||
      (filters.priceRange === '500-1000' && kuppi.price > 500 && kuppi.price <= 1000) ||
      (filters.priceRange === '1000+' && kuppi.price > 1000);

    return matchesSearch && matchesSubject && matchesLevel && matchesPrice;
  });

  