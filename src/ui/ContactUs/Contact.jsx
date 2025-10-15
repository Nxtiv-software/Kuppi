import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Users, Clock, Star } from 'lucide-react';
import styles from "../ContactUs/contact.module.css";
import img from "../../assets/images/img.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    receiveUpdates: false,
    giveConsent: false
  });

  const [isVisible, setIsVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    const element = document.querySelector(`.${styles.container}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

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

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      primary: "support@kuppi.lk",
      secondary: "We typically respond within 2 hours",
      color: "#2563eb"
    },
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      primary: "+94 77 123 4567",
      secondary: "Available 9 AM - 9 PM daily",
      color: "#059669"
    },
    {
      icon: MapPin,
      title: "Head Office",
      primary: "No. 21, Student Lane, Colombo 07",
      secondary: "Sri Lanka",
      color: "#7c3aed"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={`${styles.heroTitle} ${isVisible ? styles.visible : ''}`}>
            Let's Start a 
            <span className={styles.highlight}> Conversation</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Have questions about Kuppi.lk? Want to suggest a feature? Or looking to partner with us? 
            We'd love to hear from you and help make learning better together.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <Users className={styles.statIcon} />
              <div>
                <div className={styles.statNumber}>10,000+</div>
                <div className={styles.statLabel}>Happy Students</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <Clock className={styles.statIcon} />
              <div>
                <div className={styles.statNumber}>&lt; 2hrs</div>
                <div className={styles.statLabel}>Response Time</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <Star className={styles.statIcon} />
              <div>
                <div className={styles.statNumber}>4.9/5</div>
                <div className={styles.statLabel}>Support Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          
          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <MessageCircle className={styles.formIcon} />
              <h2 className={styles.formTitle}>Send us a Message</h2>
              <p className={styles.formDescription}>
                Fill out the form below and we'll get back to you as soon as possible. 
                Our team is here to help with any questions or feedback you have.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.nameRow}>
                <div className={`${styles.inputGroup} ${focusedInput === 'firstName' ? styles.focused : ''}`}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput(null)}
                    className={styles.input}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className={`${styles.inputGroup} ${focusedInput === 'lastName' ? styles.focused : ''}`}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput(null)}
                    className={styles.input}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className={`${styles.inputGroup} ${focusedInput === 'email' ? styles.focused : ''}`}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={styles.input}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className={`${styles.inputGroup} ${focusedInput === 'message' ? styles.focused : ''}`}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('message')}
                  onBlur={() => setFocusedInput(null)}
                  className={styles.textarea}
                  rows="5"
                  placeholder="Tell us what you're thinking about..."
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
                <Send className={styles.submitIcon} />
                Send Message
              </button>
            </form>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.contactMethods}>
              {contactMethods.map((method, index) => (
                <div 
                  key={index} 
                  className={`${styles.contactMethod} ${isVisible ? styles.slideUp : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={styles.methodIcon}>
                    {React.createElement(method.icon)}
                  </div>
                  <div className={styles.methodContent}>
                    <h3 className={styles.methodTitle}>{method.title}</h3>
                    <p className={styles.methodText}>{method.primary}</p>
                    <p className={styles.methodSubText}>{method.secondary}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.illustration}>
              <img src={img} alt="Contact illustration" className={styles.illustrationImage} />
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