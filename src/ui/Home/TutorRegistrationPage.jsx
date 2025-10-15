import React from 'react';
import TutorRegistrationForm from './TutorRegistrationForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './TutorRegistrationPage.module.css';

const TutorRegistrationPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <button 
          className={styles.backButton}
          onClick={handleClose}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <TutorRegistrationForm 
          isOpen={true}
          onClose={handleClose}
          isStandalonePage={true}
        />
      </div>
    </div>
  );
};

export default TutorRegistrationPage;