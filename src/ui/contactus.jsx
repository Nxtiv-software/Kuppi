import React, { useState } from 'react';
import styles from "../ui/contactus.module.css";
import img from "../assets/images/contactus.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    receiveUpdates: false,
    giveConsent: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.contactContainer}>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <button className={styles.writeToUsBtn}>WRITE TO US</button>
          <h1 className={styles.heroTitle}>Get In Touch</h1>
        </div>
        <div className={styles.heroDecoration}></div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Contact Form */}
          <div className={styles.formSection}>
            <h2 className={styles.formTitle}>Let's Talk!</h2>
            <p className={styles.formDescription}>
              Get in touch with us using the form below whether you have 
              questions, suggestions, or partnership ideas.
            </p>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.nameRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="5"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  I'd like to receive updates about upcoming sessions and features.
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="giveConsent"
                    checked={formData.giveConsent}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  I give my consent to Kuppi.lk to store and use my data for communication.
                </label>
              </div>

              <div className={styles.privacyNote}>
                <p>
                  Kuppi.lk is committed to protecting your privacy. Read our{' '}
                  <a href="#" className={styles.privacyLink}>Privacy Policy</a>{' '}
                  to learn how we handle your data.
                </p>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>

          
          <div className={styles.contactInfo}>
            <div className={styles.illustration}>
              <img src={img} alt="Contact illustration" className={styles.illustrationImage} />
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <div className={styles.emailIcon}>📧</div>
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Quick Contact:</h3>
                  <p className={styles.contactText}>Email: support@kuppi.lk</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <div className={styles.phoneIcon}>📞</div>
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Phone Number:</h3>
                  <p className={styles.contactText}>Sri Lanka: +94 77 123 4567</p>
                  <p className={styles.contactText}>WhatsApp: +94 76 654 3210</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <div className={styles.locationIcon}>📍</div>
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Head Office:</h3>
                  <p className={styles.contactText}>No. 21, Student Lane, Colombo 07,</p>
                  <p className={styles.contactText}>Sri Lanka</p>
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Follow Us</h3>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>
                  <div className={styles.facebookIcon}>f</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <div className={styles.instagramIcon}>📷</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <div className={styles.linkedinIcon}>in</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;