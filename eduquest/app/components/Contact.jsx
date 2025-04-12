"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Contact.module.css';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    
    try {
      // Simulate API call
      await axios.post("/adminreport",formData);
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        content: ''
      });
    } catch (error) {
      setSubmitMessage('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | EduQuest</title>
        <meta name="description" content="Get in touch with the EduQuest team" />
      </Head>

      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1>Contact Us</h1>
          <p>Have questions or feedback? We'd love to hear from you.</p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Message</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div className={styles.submitMessage}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3>Contact Information</h3>
              <ul>
                <li>
                  <span className={styles.icon}>📍</span>
                  <span>123 Education Street, Learning City, 10101</span>
                </li>
                <li>
                  <span className={styles.icon}>📞</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <span className={styles.icon}>✉️</span>
                  <span>support@eduquest.com</span>
                </li>
              </ul>
            </div>

            <div className={styles.hoursCard}>
              <h3>Support Hours</h3>
              <ul>
                <li><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM</li>
                <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li>
                <li><strong>Sunday:</strong> Closed</li>
              </ul>
            </div>

            <div className={styles.socialCard}>
              <h3>Connect With Us</h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>Twitter</a>
                <a href="#" className={styles.socialLink}>LinkedIn</a>
                <a href="#" className={styles.socialLink}>Facebook</a>
                <a href="#" className={styles.socialLink}>Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;