import React, { useState } from 'react';
import styles from './UserManagement.module.css';

const UserManagement = ({ setActiveTab }) => {
  const [activeUserTab, setActiveUserTab] = useState('students');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const students = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      joinDate: '2024-01-15', 
      status: 'active', 
      sessions: 12,
      phone: '+94 77 123 4567',
      lastActive: '2024-10-14',
      totalSpent: 'Rs. 25,000',
      favoriteSubjects: ['Mathematics', 'Physics'],
      activityScore: 85
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      joinDate: '2024-02-20', 
      status: 'active', 
      sessions: 8,
      phone: '+94 77 234 5678',
      lastActive: '2024-10-15',
      totalSpent: 'Rs. 18,500',
      favoriteSubjects: ['Chemistry', 'Biology'],
      activityScore: 92
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      joinDate: '2024-01-10', 
      status: 'suspended', 
      sessions: 3,
      phone: '+94 77 345 6789',
      lastActive: '2024-09-20',
      totalSpent: 'Rs. 5,200',
      favoriteSubjects: ['Mathematics'],
      activityScore: 45,
      suspendedReason: 'Violation of community guidelines'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah@example.com', 
      joinDate: '2024-03-05', 
      status: 'active', 
      sessions: 15,
      phone: '+94 77 456 7890',
      lastActive: '2024-10-15',
      totalSpent: 'Rs. 32,000',
      favoriteSubjects: ['Physics', 'Mathematics', 'Chemistry'],
      activityScore: 96
    }
  ];

  const tutors = [
    { 
      id: 1, 
      name: 'Dr. Robert Chen', 
      email: 'robert@example.com', 
      subject: 'Mathematics', 
      rating: 4.8, 
      students: 45, 
      status: 'verified',
      phone: '+94 77 567 8901',
      joinDate: '2024-01-05',
      qualifications: 'PhD Mathematics, University of Colombo',
      experience: '8 years',
      totalEarnings: 'Rs. 185,000',
      completionRate: 98,
      responseTime: '2 minutes',
      verificationDate: '2024-01-10',
      documents: ['Degree Certificate', 'ID Copy', 'Police Report']
    },
    { 
      id: 2, 
      name: 'Prof. Lisa Anderson', 
      email: 'lisa@example.com', 
      subject: 'Physics', 
      rating: 4.7, 
      students: 38, 
      status: 'verified',
      phone: '+94 77 678 9012',
      joinDate: '2024-01-12',
      qualifications: 'MSc Physics, University of Peradeniya',
      experience: '6 years',
      totalEarnings: 'Rs. 142,000',
      completionRate: 95,
      responseTime: '5 minutes',
      verificationDate: '2024-01-18',
      documents: ['Degree Certificate', 'ID Copy', 'Police Report']
    },
    { 
      id: 3, 
      name: 'Mr. David Brown', 
      email: 'david@example.com', 
      subject: 'Chemistry', 
      rating: 4.9, 
      students: 52, 
      status: 'pending',
      phone: '+94 77 789 0123',
      joinDate: '2024-10-10',
      qualifications: 'BSc Chemistry, University of Moratuwa',
      experience: '4 years',
      totalEarnings: 'Rs. 0',
      completionRate: 0,
      responseTime: 'N/A',
      verificationDate: null,
      documents: ['Degree Certificate', 'ID Copy'],
      pendingDocuments: ['Police Report']
    },
    { 
      id: 4, 
      name: 'Ms. Emily Davis', 
      email: 'emily@example.com', 
      subject: 'Biology', 
      rating: 4.6, 
      students: 29, 
      status: 'verified',
      phone: '+94 77 890 1234',
      joinDate: '2024-02-15',
      qualifications: 'MSc Biology, University of Sri Jayewardenepura',
      experience: '5 years',
      totalEarnings: 'Rs. 98,000',
      completionRate: 92,
      responseTime: '3 minutes',
      verificationDate: '2024-02-20',
      documents: ['Degree Certificate', 'ID Copy', 'Police Report']
    }
  ];

  const handleUserAction = (action, userId, userType = 'student') => {
    console.log(`${action} ${userType} with ID: ${userId}`);
    
    // Implement user action logic here
    switch(action) {
      case 'view':
        const userData = userType === 'student' 
          ? students.find(s => s.id === userId)
          : tutors.find(t => t.id === userId);
        setShowUserProfile({ ...userData, type: userType });
        break;
      case 'suspend':
        // Handle suspension logic
        alert(`${userType} suspended successfully`);
        break;
      case 'reactivate':
        // Handle reactivation logic
        alert(`${userType} reactivated successfully`);
        break;
      case 'ban':
        // Handle ban logic
        if (window.confirm(`Are you sure you want to ban this ${userType}?`)) {
          alert(`${userType} banned successfully`);
        }
        break;
      case 'verify':
        // Handle tutor verification
        if (userType === 'tutor') {
          alert('Tutor verified successfully');
        }
        break;
      case 'reject':
        // Handle tutor rejection
        if (userType === 'tutor') {
          const reason = prompt('Please provide a reason for rejection:');
          if (reason) {
            alert(`Tutor application rejected: ${reason}`);
          }
        }
        break;
      case 'assignRole':
        setShowRoleModal(userId);
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    console.log(`${action} selected users:`, selectedUsers);
    
    switch(action) {
      case 'message':
        alert(`Sending message to ${selectedUsers.length} users`);
        break;
      case 'suspend':
        if (window.confirm(`Suspend ${selectedUsers.length} selected users?`)) {
          alert(`${selectedUsers.length} users suspended`);
          setSelectedUsers([]);
        }
        break;
      case 'reactivate':
        if (window.confirm(`Reactivate ${selectedUsers.length} selected users?`)) {
          alert(`${selectedUsers.length} users reactivated`);
          setSelectedUsers([]);
        }
        break;
      case 'export':
        alert(`Exporting ${selectedUsers.length} user records`);
        break;
      default:
        break;
    }
  };

  const handleRoleAssignment = (userId, newRole) => {
    console.log(`Assigning role ${newRole} to user ${userId}`);
    alert(`Role ${newRole} assigned successfully`);
    setShowRoleModal(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.userManagement}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeUserTab === 'students' ? styles.active : ''}`}
          onClick={() => setActiveUserTab('students')}
        >
          Students ({students.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeUserTab === 'tutors' ? styles.active : ''}`}
          onClick={() => setActiveUserTab('tutors')}
        >
          Tutors ({tutors.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeUserTab === 'roles' ? styles.active : ''}`}
          onClick={() => setActiveUserTab('roles')}
        >
          Role Assignment
        </button>
        <button
          className={`${styles.tabButton} ${activeUserTab === 'permissions' ? styles.active : ''}`}
          onClick={() => setActiveUserTab('permissions')}
        >
          Permissions
        </button>
      </div>

      {/* Students List */}
      {activeUserTab === 'students' && (
        <div className={styles.tabContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Student Management</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search students..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className={styles.exportButton} onClick={() => handleBulkAction('export')}>
                Export Data
              </button>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className={styles.bulkActions}>
              <span className={styles.selectedCount}>{selectedUsers.length} users selected</span>
              <button 
                className={styles.bulkButton}
                onClick={() => handleBulkAction('message')}
              >
                Send Message
              </button>
              <button 
                className={`${styles.bulkButton} ${styles.warning}`}
                onClick={() => handleBulkAction('suspend')}
              >
                Suspend Users
              </button>
              <button 
                className={`${styles.bulkButton} ${styles.success}`}
                onClick={() => handleBulkAction('reactivate')}
              >
                Reactivate Users
              </button>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredStudents.map(s => s.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Activity</th>
                  <th>Sessions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, student.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== student.id));
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{student.name.charAt(0)}</div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{student.name}</span>
                          <span className={styles.userMeta}>ID: {student.id} • Joined {student.joinDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div>{student.email}</div>
                        <div className={styles.phoneNumber}>{student.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.activityInfo}>
                        <div>Last active: {student.lastActive}</div>
                        <div className={styles.activityScore}>Score: {student.activityScore}%</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.sessionInfo}>
                        <strong>{student.sessions}</strong>
                        <span className={styles.totalSpent}>{student.totalSpent}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${styles[student.status]}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => handleUserAction('view', student.id, 'student')}
                          title="View Profile"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        {student.status === 'active' ? (
                          <button 
                            className={`${styles.actionBtn} ${styles.warning}`}
                            onClick={() => handleUserAction('suspend', student.id, 'student')}
                            title="Suspend User"
                          >
                            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        ) : student.status === 'suspended' ? (
                          <button 
                            className={`${styles.actionBtn} ${styles.success}`}
                            onClick={() => handleUserAction('reactivate', student.id, 'student')}
                            title="Reactivate User"
                          >
                            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        ) : null}
                        <button 
                          className={`${styles.actionBtn} ${styles.primary}`}
                          onClick={() => handleUserAction('assignRole', student.id, 'student')}
                          title="Assign Role"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleUserAction('ban', student.id, 'student')}
                          title="Ban User"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tutors List */}
      {activeUserTab === 'tutors' && (
        <div className={styles.tabContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Tutor Management & Verification</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search tutors..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Tutors</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className={styles.exportButton} onClick={() => handleBulkAction('export')}>
                Export Data
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredTutors.map(t => t.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th>Tutor</th>
                  <th>Contact & Subject</th>
                  <th>Performance</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutors.map(tutor => (
                  <tr key={tutor.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(tutor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, tutor.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== tutor.id));
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{tutor.name.charAt(0)}</div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{tutor.name}</span>
                          <span className={styles.userMeta}>ID: {tutor.id} • {tutor.experience} experience</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div>{tutor.email}</div>
                        <div className={styles.phoneNumber}>{tutor.phone}</div>
                        <div className={styles.subject}>{tutor.subject}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.performanceInfo}>
                        <div className={styles.rating}>
                          <span>
                            <svg className={styles.statusIcon} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            {tutor.rating}
                          </span>
                          <span className={styles.students}>{tutor.students} students</span>
                        </div>
                        <div className={styles.metrics}>
                          <span>Completion: {tutor.completionRate}%</span>
                          <span>Response: {tutor.responseTime}</span>
                        </div>
                        <div className={styles.earnings}>{tutor.totalEarnings}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.verificationInfo}>
                        {tutor.verificationDate ? (
                          <div className={styles.verified}>
                            <span>
                              <svg className={styles.statusIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              Verified
                            </span>
                            <span className={styles.verifyDate}>{tutor.verificationDate}</span>
                          </div>
                        ) : (
                          <div className={styles.pending}>
                            <span>
                              <svg className={styles.statusIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                              </svg>
                              Pending
                            </span>
                            {tutor.pendingDocuments && (
                              <span className={styles.missing}>Missing: {tutor.pendingDocuments.join(', ')}</span>
                            )}
                          </div>
                        )}
                        <div className={styles.documents}>
                          <span>
                            <svg className={styles.statusIcon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                            </svg>
                            {tutor.documents.length} docs
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${styles[tutor.status]}`}>
                        {tutor.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => handleUserAction('view', tutor.id, 'tutor')}
                          title="View Profile"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        {tutor.status === 'pending' && (
                          <>
                            <button 
                              className={`${styles.actionBtn} ${styles.success}`}
                              onClick={() => handleUserAction('verify', tutor.id, 'tutor')}
                              title="Verify & Approve"
                            >
                              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.danger}`}
                              onClick={() => handleUserAction('reject', tutor.id, 'tutor')}
                              title="Reject Application"
                            >
                              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          </>
                        )}
                        {tutor.status === 'verified' && (
                          <button 
                            className={`${styles.actionBtn} ${styles.warning}`}
                            onClick={() => handleUserAction('suspend', tutor.id, 'tutor')}
                            title="Suspend Tutor"
                          >
                            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        )}
                        {tutor.status === 'suspended' && (
                          <button 
                            className={`${styles.actionBtn} ${styles.success}`}
                            onClick={() => handleUserAction('reactivate', tutor.id, 'tutor')}
                            title="Reactivate Tutor"
                          >
                            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        )}
                        <button 
                          className={`${styles.actionBtn} ${styles.primary}`}
                          onClick={() => handleUserAction('assignRole', tutor.id, 'tutor')}
                          title="Assign Role"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleUserAction('ban', tutor.id, 'tutor')}
                          title="Ban Tutor"
                        >
                          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Assignment */}
      {activeUserTab === 'roles' && (
        <div className={styles.tabContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Role Assignment</h2>
          </div>
          
          <div className={styles.roleManagement}>
            <div className={styles.roleCard}>
              <h3 className={styles.roleTitle}>Assign Role to User</h3>
              <div className={styles.roleForm}>
                <input
                  type="email"
                  placeholder="Enter user email"
                  className={styles.roleInput}
                />
                <select className={styles.roleSelect}>
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <button className={styles.assignButton}>Assign Role</button>
              </div>
            </div>

            <div className={styles.roleCard}>
              <h3 className={styles.roleTitle}>Current Role Assignments</h3>
              <div className={styles.roleList}>
                <div className={styles.roleItem}>
                  <div className={styles.roleUserInfo}>
                    <span className={styles.roleUserName}>admin@kuppi.lk</span>
                    <span className={styles.roleUserEmail}>Super Administrator</span>
                  </div>
                  <span className={styles.roleBadge}>Admin</span>
                </div>
                
                <div className={styles.roleItem}>
                  <div className={styles.roleUserInfo}>
                    <span className={styles.roleUserName}>moderator@kuppi.lk</span>
                    <span className={styles.roleUserEmail}>Content Moderator</span>
                  </div>
                  <span className={styles.roleBadge}>Moderator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions */}
      {activeUserTab === 'permissions' && (
        <div className={styles.tabContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Permission Control</h2>
          </div>

          <div className={styles.permissionsGrid}>
            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>Student Permissions</h3>
              <div className={styles.permissionList}>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Join Sessions</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Request Sessions</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Rate Tutors</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" />
                  <span>Create Study Groups</span>
                </label>
              </div>
            </div>

            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>Tutor Permissions</h3>
              <div className={styles.permissionList}>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Create Sessions</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Upload Materials</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Manage Students</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" />
                  <span>Bulk Communications</span>
                </label>
              </div>
            </div>

            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>Admin Permissions</h3>
              <div className={styles.permissionList}>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>User Management</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Financial Reports</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>System Settings</span>
                </label>
                <label className={styles.permissionItem}>
                  <input type="checkbox" defaultChecked />
                  <span>Platform Analytics</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.permissionActions}>
            <button className={styles.saveButton}>Save Changes</button>
            <button className={styles.resetButton}>Reset to Default</button>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className={styles.modal} onClick={() => setShowUserProfile(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>User Profile - {showUserProfile.name}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowUserProfile(null)}
              >
                <svg fill="currentColor" viewBox="0 0 20 20" className={styles.closeIcon}>
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.profileGrid}>
                <div className={styles.profileSection}>
                  <h3>Personal Information</h3>
                  <div className={styles.profileField}>
                    <label>Name:</label>
                    <span>{showUserProfile.name}</span>
                  </div>
                  <div className={styles.profileField}>
                    <label>Email:</label>
                    <span>{showUserProfile.email}</span>
                  </div>
                  <div className={styles.profileField}>
                    <label>Phone:</label>
                    <span>{showUserProfile.phone}</span>
                  </div>
                  <div className={styles.profileField}>
                    <label>Status:</label>
                    <span className={`${styles.status} ${styles[showUserProfile.status]}`}>
                      {showUserProfile.status}
                    </span>
                  </div>
                </div>

                {showUserProfile.type === 'student' && (
                  <div className={styles.profileSection}>
                    <h3>Student Details</h3>
                    <div className={styles.profileField}>
                      <label>Join Date:</label>
                      <span>{showUserProfile.joinDate}</span>
                    </div>
                    <div className={styles.profileField}>
                      <label>Sessions Attended:</label>
                      <span>{showUserProfile.sessions}</span>
                    </div>
                    <div className={styles.profileField}>
                      <label>Total Spent:</label>
                      <span>{showUserProfile.totalSpent}</span>
                    </div>
                    <div className={styles.profileField}>
                      <label>Activity Score:</label>
                      <span>{showUserProfile.activityScore}%</span>
                    </div>
                    <div className={styles.profileField}>
                      <label>Favorite Subjects:</label>
                      <span>{showUserProfile.favoriteSubjects?.join(', ')}</span>
                    </div>
                    {showUserProfile.suspendedReason && (
                      <div className={styles.profileField}>
                        <label>Suspended Reason:</label>
                        <span className={styles.suspendedReason}>{showUserProfile.suspendedReason}</span>
                      </div>
                    )}
                  </div>
                )}

                {showUserProfile.type === 'tutor' && (
                  <>
                    <div className={styles.profileSection}>
                      <h3>Tutor Details</h3>
                      <div className={styles.profileField}>
                        <label>Subject:</label>
                        <span>{showUserProfile.subject}</span>
                      </div>
                      <div className={styles.profileField}>
                        <label>Qualifications:</label>
                        <span>{showUserProfile.qualifications}</span>
                      </div>
                      <div className={styles.profileField}>
                        <label>Experience:</label>
                        <span>{showUserProfile.experience}</span>
                      </div>
                      <div className={styles.profileField}>
                        <label>Rating:</label>
                        <span>
                          <svg className={styles.ratingIcon} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {showUserProfile.rating}
                        </span>
                      </div>
                      <div className={styles.profileField}>
                        <label>Students:</label>
                        <span>{showUserProfile.students}</span>
                      </div>
                      <div className={styles.profileField}>
                        <label>Total Earnings:</label>
                        <span>{showUserProfile.totalEarnings}</span>
                      </div>
                    </div>
                    
                    <div className={styles.profileSection}>
                      <h3>Verification Status</h3>
                      <div className={styles.profileField}>
                        <label>Status:</label>
                        <span className={showUserProfile.verificationDate ? styles.verified : styles.pending}>
                          {showUserProfile.verificationDate ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      {showUserProfile.verificationDate && (
                        <div className={styles.profileField}>
                          <label>Verification Date:</label>
                          <span>{showUserProfile.verificationDate}</span>
                        </div>
                      )}
                      <div className={styles.profileField}>
                        <label>Documents:</label>
                        <div className={styles.documentList}>
                          {showUserProfile.documents.map((doc, index) => (
                            <span key={index} className={styles.documentItem}>
                              <svg className={styles.docIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              {doc}
                            </span>
                          ))}
                          {showUserProfile.pendingDocuments?.map((doc, index) => (
                            <span key={index} className={styles.documentPending}>
                              <svg className={styles.docIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                              </svg>
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.modalButton} ${styles.primary}`}
                onClick={() => setShowUserProfile(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className={styles.modal} onClick={() => setShowRoleModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Assign Role</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowRoleModal(null)}
              >
                <svg fill="currentColor" viewBox="0 0 20 20" className={styles.closeIcon}>
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.roleAssignmentForm}>
                <div className={styles.formGroup}>
                  <label>Select New Role:</label>
                  <select className={styles.roleSelect}>
                    <option value="">Choose Role</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Reason for Change:</label>
                  <textarea 
                    className={styles.reasonTextarea}
                    placeholder="Please provide a reason for this role change..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.modalButton} ${styles.secondary}`}
                onClick={() => setShowRoleModal(null)}
              >
                Cancel
              </button>
              <button 
                className={`${styles.modalButton} ${styles.primary}`}
                onClick={() => {
                  const roleSelect = document.querySelector(`.${styles.roleSelect}`);
                  if (roleSelect.value) {
                    handleRoleAssignment(showRoleModal, roleSelect.value);
                  }
                }}
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;