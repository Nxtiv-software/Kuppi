import React from 'react';
import styles from './Earnings.module.css';

const earningsData = {
  thisMonth: 45000,
  lastMonth: 38500,
  thisYear: 420000,
  totalEarnings: 1250000,
  pendingPayouts: 12500,
  nextPayout: '2024-07-01'
};

const recentTransactions = [
  {
    id: 1,
    sessionTitle: 'Data Structures & Algorithms',
    date: '2024-06-25',
    students: 15,
    amount: 4500,
    status: 'paid'
  },
  {
    id: 2,
    sessionTitle: 'Database Systems',
    date: '2024-06-23',
    students: 12,
    amount: 3600,
    status: 'paid'
  },
  {
    id: 3,
    sessionTitle: 'Machine Learning Basics',
    date: '2024-06-20',
    students: 18,
    amount: 5400,
    status: 'pending'
  }
];

const getStatusClass = (status) => {
  switch (status) {
    case 'paid': return styles.paid;
    case 'pending': return styles.pending;
    case 'failed': return styles.failed;
    default: return '';
  }
};

const Earnings = () => {
  const growthPercentage = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);

  return (
    <div className={styles.earnings}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Earnings Dashboard</h2>
          <p className={styles.subtitle}>Track your income and payment history</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.actionButton} ${styles.outline}`}>
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
          <button className={`${styles.actionButton} ${styles.primary}`}>
            <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payout Settings
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>This Month</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className={styles.statValue}>Rs. {earningsData.thisMonth.toLocaleString()}</div>
          <p className={styles.statSubtitle}>+{growthPercentage}% from last month</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>This Year</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className={styles.statValue}>Rs. {(earningsData.thisYear / 1000).toFixed(0)}K</div>
          <p className={styles.statSubtitle}>6 months of teaching</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Pending Payout</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className={styles.statValue}>Rs. {earningsData.pendingPayouts.toLocaleString()}</div>
          <p className={styles.statSubtitle}>Next: {new Date(earningsData.nextPayout).toLocaleDateString()}</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Total Earned</h3>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className={styles.statValue}>Rs. {(earningsData.totalEarnings / 1000).toFixed(0)}K</div>
          <p className={styles.statSubtitle}>Since joining platform</p>
        </div>
      </div>

      <div className={styles.transactionsContainer}>
        <h2 className={styles.sectionTitle}>Recent Transactions</h2>
        <div className={styles.transactionsList}>
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionContent}>
                <div className={styles.transactionInfo}>
                  <h4 className={styles.transactionTitle}>{transaction.sessionTitle}</h4>
                  <div className={styles.transactionDetails}>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>{transaction.students} students</span>
                    <span>Session Payment</span>
                  </div>
                </div>
                
                <div className={styles.transactionMeta}>
                  <span className={`${styles.badge} ${getStatusClass(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                  
                  <div className={styles.transactionAmount}>
                    <div className={styles.amountValue}>
                      Rs. {transaction.amount.toLocaleString()}
                    </div>
                    <div className={styles.amountPerStudent}>
                      Rs. {Math.round(transaction.amount / transaction.students)}/student
                    </div>
                  </div>
                  
                  <button className={styles.detailsButton}>
                    <svg className={styles.detailsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className={styles.viewAllButton}>View All Transactions</button>
      </div>

      <div className={styles.payoutContainer}>
        <h2 className={styles.sectionTitle}>Payout Information</h2>
        <div className={styles.payoutGrid}>
          <div className={styles.payoutSection}>
            <h4 className={styles.payoutSectionTitle}>Payment Schedule</h4>
            <div className={styles.payoutDetails}>
              <div className={styles.payoutDetail}>
                <span className={styles.payoutLabel}>Payout Frequency:</span>
                <span className={styles.payoutValue}>Weekly</span>
              </div>
              <div className={styles.payoutDetail}>
                <span className={styles.payoutLabel}>Next Payout:</span>
                <span className={styles.payoutValue}>{new Date(earningsData.nextPayout).toLocaleDateString()}</span>
              </div>
              <div className={styles.payoutDetail}>
                <span className={styles.payoutLabel}>Processing Time:</span>
                <span className={styles.payoutValue}>2-3 business days</span>
              </div>
            </div>
          </div>
          
          <div className={styles.payoutSection}>
            <h4 className={styles.payoutSectionTitle}>Payment Method</h4>
            <div className={styles.payoutDetails}>
              <div className={styles.payoutDetail}>
                <span className={styles.payoutLabel}>Bank Account:</span>
                <span className={styles.payoutValue}>****1234</span>
              </div>
              <div className={styles.payoutDetail}>
                <span className={styles.payoutLabel}>Bank:</span>
                <span className={styles.payoutValue}>Commercial Bank</span>
              </div>
              <button className={styles.updateButton}>
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;