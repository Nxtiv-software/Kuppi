import React, { useState } from 'react';
import styles from './PaymentFinance.module.css';

const PaymentFinance = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className={styles.paymentFinance}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payments</h2>
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'transactions' ? styles.active : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'payouts' ? styles.active : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            Tutor Payouts
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'refunds' ? styles.active : ''}`}
            onClick={() => setActiveTab('refunds')}
          >
            Refunds
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'transactions' && (
          <div>
            <h3>All Transactions</h3>
            <p className={styles.placeholder}>Transaction tracking interface - Coming soon</p>
          </div>
        )}
        {activeTab === 'payouts' && (
          <div>
            <h3>Tutor Payouts</h3>
            <p className={styles.placeholder}>Payout management interface - Coming soon</p>
          </div>
        )}
        {activeTab === 'refunds' && (
          <div>
            <h3>Refund Management</h3>
            <p className={styles.placeholder}>Refund processing interface - Coming soon</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
            <h3>Payment Analytics</h3>
            <p className={styles.placeholder}>Payment method analytics - Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFinance;