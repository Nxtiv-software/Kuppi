import React, { useState } from 'react';
import { X, User, Mail, Phone, BookOpen, GraduationCap, Clock, MapPin, FileText, Star } from 'lucide-react';
import styles from './TutorRegistrationForm.module.css';

const TutorRegistrationForm = ({ isOpen, onClose, isStandalonePage = false }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    
    // Academic Qualifications
    highestQualification: '',
    university: '',
    graduationYear: '',
    currentGPA: '',
    
    // Teaching Information
    subjects: [],
    gradesTaught: [],
    teachingExperience: '',
    preferredTeachingMode: '',
    
    // Availability
    availableDays: [],
    timeSlots: [],
    maxStudentsPerSession: '',
    
    // Additional Information
    bio: '',
    specializations: '',
    achievements: '',
    whyTeach: '',
    
    // Requirements
    hasLaptop: false,
    hasStableInternet: false,
    agreeToTerms: false
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 
    'Accounting', 'Business Studies', 'History', 'Geography', 
    'Sinhala', 'English', 'Tamil', 'ICT', 'Art', 'Music'
  ];

  const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'O/L', 'A/L'];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeSlots = [
    'Early Morning (6:00-8:00 AM)',
    'Morning (8:00-12:00 PM)',
    'Afternoon (12:00-5:00 PM)',
    'Evening (5:00-8:00 PM)',
    'Night (8:00-10:00 PM)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tutor Registration Data:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your interest in becoming a tutor! We will review your application and get back to you soon.');
    onClose();
  };

  if (!isOpen) return null;

  const containerClass = isStandalonePage ? styles.standaloneContainer : styles.modalOverlay;
  const handleOverlayClick = isStandalonePage ? undefined : onClose;

  return (
    <div className={containerClass} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Become a Tutor</h2>
            <p className={styles.subtitle}>Join our community of expert tutors and help students succeed</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Personal Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User className={styles.sectionIcon} />
              <h3>Personal Information</h3>
            </div>
            
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
            </div>
          </div>

          {/* Academic Qualifications */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <GraduationCap className={styles.sectionIcon} />
              <h3>Academic Qualifications</h3>
            </div>
            
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Highest Qualification *</label>
                <select
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="A/L">A/L Completed</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>University/Institution</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="University of Colombo"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  placeholder="2023"
                  min="1990"
                  max="2030"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>GPA/Results</label>
                <input
                  type="text"
                  name="currentGPA"
                  value={formData.currentGPA}
                  onChange={handleInputChange}
                  placeholder="3.5 or A passes"
                />
              </div>
            </div>
          </div>

          {/* Teaching Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <BookOpen className={styles.sectionIcon} />
              <h3>Teaching Information</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Subjects You Can Teach *</label>
              <div className={styles.checkboxGrid}>
                {subjects.map(subject => (
                  <label key={subject} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleMultiSelect('subjects', subject)}
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Grade Levels *</label>
              <div className={styles.checkboxGrid}>
                {grades.map(grade => (
                  <label key={grade} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={formData.gradesTaught.includes(grade)}
                      onChange={() => handleMultiSelect('gradesTaught', grade)}
                    />
                    <span>{grade}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Teaching Experience</label>
                <select
                  name="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={handleInputChange}
                >
                  <option value="">Select experience</option>
                  <option value="none">No formal experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Preferred Teaching Mode *</label>
                <select
                  name="preferredTeachingMode"
                  value={formData.preferredTeachingMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select mode</option>
                  <option value="online">Online Only</option>
                  <option value="physical">In-Person Only</option>
                  <option value="hybrid">Both Online & In-Person</option>
                </select>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Clock className={styles.sectionIcon} />
              <h3>Availability</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Available Days</label>
              <div className={styles.checkboxGrid}>
                {days.map(day => (
                  <label key={day} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={() => handleMultiSelect('availableDays', day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Preferred Time Slots</label>
              <div className={styles.checkboxGrid}>
                {timeSlots.map(slot => (
                  <label key={slot} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={formData.timeSlots.includes(slot)}
                      onChange={() => handleMultiSelect('timeSlots', slot)}
                    />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Maximum Students per Session</label>
              <select
                name="maxStudentsPerSession"
                value={formData.maxStudentsPerSession}
                onChange={handleInputChange}
              >
                <option value="">Select preference</option>
                <option value="1">1 student (Individual)</option>
                <option value="2-5">2-5 students (Small group)</option>
                <option value="6-15">6-15 students (Medium group)</option>
                <option value="15+">15+ students (Large group)</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText className={styles.sectionIcon} />
              <h3>Additional Information</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Tell us about yourself</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief introduction about yourself, your background, and teaching approach..."
                rows="3"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Specializations & Strengths</label>
              <textarea
                name="specializations"
                value={formData.specializations}
                onChange={handleInputChange}
                placeholder="What are your special areas of expertise or teaching methods?"
                rows="2"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Achievements & Certifications</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                placeholder="Any awards, certifications, or notable achievements..."
                rows="2"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Why do you want to teach?</label>
              <textarea
                name="whyTeach"
                value={formData.whyTeach}
                onChange={handleInputChange}
                placeholder="Share your motivation for becoming a tutor..."
                rows="3"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Star className={styles.sectionIcon} />
              <h3>Requirements</h3>
            </div>
            
            <div className={styles.checkboxList}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="hasLaptop"
                  checked={formData.hasLaptop}
                  onChange={handleInputChange}
                />
                <span>I have access to a laptop/computer for online sessions</span>
              </label>
              
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="hasStableInternet"
                  checked={formData.hasStableInternet}
                  onChange={handleInputChange}
                />
                <span>I have stable internet connection for online teaching</span>
              </label>
              
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                <span>I agree to the Terms & Conditions and Privacy Policy *</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitButton}>
              Submit Application
            </button>
            <p className={styles.submitNote}>
              We'll review your application within 2-3 business days and get back to you via email.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TutorRegistrationForm;