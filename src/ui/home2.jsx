import React, { useState, useRef } from 'react';
import styles from "../ui/home2.module.css";

const Home2 = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const votingRef = useRef(null);

  // Sample data - replace with your actual data
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'computer', name: 'Computer Science' },
    { id: 'english', name: 'English Literature' }
  ];

  const chaptersBySubject = {
    math: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'],
    physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
    chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
    biology: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Anatomy'],
    computer: ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development', 'Machine Learning'],
    english: ['Poetry Analysis', 'Novel Studies', 'Drama', 'Creative Writing', 'Literary Criticism']
  };

  const trendingTopics = [
    { topic: 'Calculus Integration', votes: 45, progress: 90 },
    { topic: 'Organic Chemistry Reactions', votes: 38, progress: 76 },
    { topic: 'Data Structures - Trees', votes: 32, progress: 64 },
    { topic: 'Physics Mechanics', votes: 28, progress: 56 },
    { topic: 'limits', votes: 25, progress: 50 }
  ];

  const handleVoteNowClick = () => {
    votingRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedChapters([]);
    setCustomTopic('');
  };

  const handleChapterToggle = (chapter) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const handleSubmitVote = () => {
    if (!selectedSubject || (selectedChapters.length === 0 && !customTopic)) {
      alert('Please select a subject and at least one chapter or enter a custom topic.');
      return;
    }

    // Here you would typically send the data to your backend
    console.log({
      subject: selectedSubject,
      chapters: selectedChapters,
      customTopic,
      email
    });

    // Show success toast
    setShowToast(true);
    setShowEmailInput(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
    
    // Reset form
    setSelectedSubject('');
    setSelectedChapters([]);
    setCustomTopic('');
  };

return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            We're not here to teach the ordinary syllabus. We're here to help you with what you're struggling to learn.
          </h1>
          <p className={styles.heroSubtitle}>
            Vote on what you need help with, We'll organize a session with expert tutors, just for that.
          </p>
          
          <div className={styles.heroCard}>
            <h2 className={styles.cardTitle}>Tell us what you need help with</h2>
            <p className={styles.cardSubtitle}>
              Vote for what you need help with, or Find the session that you need.
            </p>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.voteButton}
                onClick={handleVoteNowClick}
              >
                Vote Now
              </button>
              <button className={styles.exploreButton}>
                Explore Sessions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Voting Section */}
      <section ref={votingRef} className={styles.votingSection}>
        <div className={styles.votingContainer}>
          <h2 className={styles.votingTitle}>Vote for the Chapter You're Struggling With</h2>
          <p className={styles.votingDescription}>
            Help us understand what topics you need help with. We'll organize expert-led sessions based on your votes.
          </p>

          <div className={styles.votingForm}>
            {/* Subject Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>📚</span>
                Select Subject
              </label>
              <select 
                className={styles.dropdown}
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                <option value="">Choose a subject...</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            {selectedSubject && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>📖</span>
                  Select Chapters (Choose multiple)
                </label>
                <div className={styles.checkboxGrid}>
                  {chaptersBySubject[selectedSubject]?.map(chapter => (
                    <label key={chapter} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedChapters.includes(chapter)}
                        onChange={() => handleChapterToggle(chapter)}
                      />
                      <span className={styles.checkboxText}>{chapter}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Topic */}
            {selectedSubject && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>✏️</span>
                  Or Enter Custom Topic
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Type your specific topic or question..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              </div>
            )}

            {/* Submit Button */}
            {selectedSubject && (
              <button 
                className={styles.submitButton}
                onClick={handleSubmitVote}
              >
                Submit My Vote
              </button>
            )}
          </div>

          {/* Email Subscription */}
          {showEmailInput && (
            <div className={styles.emailSection}>
              <h3 className={styles.emailTitle}>Get notified when your session is scheduled</h3>
              <div className={styles.emailGroup}>
                <input
                  type="email"
                  className={styles.emailInput}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className={styles.emailButton}>Subscribe</button>
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className={styles.trendingSection}>
            <h3 className={styles.trendingTitle}>Trending Topics</h3>
            <div className={styles.trendingList}>
              {trendingTopics.map((item, index) => (
                <div key={index} className={styles.trendingItem}>
                  <div className={styles.trendingInfo}>
                    <span className={styles.trendingTopic}>{item.topic}</span>
                    <span className={styles.trendingVotes}>{item.votes} votes</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      {showToast && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>✅</span>
          <span className={styles.toastText}>Vote submitted successfully!</span>
        </div>
      )}
    </div>
  );
};

export default Home2;