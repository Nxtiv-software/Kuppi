import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import SessionManagement from './SessionManagement';
import PaymentFinance from './PaymentFinance';
import NotificationsCommunication from './NotificationsCommunication';
import SystemSettings from './SystemSettings';
import Header from "../../ui/Home/Header";

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'User Management' },
    { id: 'sessions', label: 'Session Management' },
    { id: 'payments', label: 'Payments' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'System Settings' }
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview setActiveTab={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'sessions':
        return <SessionManagement />;
      case 'payments':
        return <PaymentFinance />;
      case 'notifications':
        return <NotificationsCommunication />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Manage users, sessions, payments, and platform settings
          </p>
        </div>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;