import React from 'react';
import styles from '../styles/JoinCoursePopup.module.css';

const JoinCoursePopup = ({ onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h1 className={styles.popupTitle}>Join Course</h1>
        <div className={styles.formGroup}>
          <label htmlFor="courseCode" className={styles.inputLabel}>
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            className={styles.codeInput}
            placeholder="Enter course code"
          />
        </div>
        <button className={styles.joinButton}>Join Course</button>
      </div>
    </div>
  );
};

export default JoinCoursePopup;