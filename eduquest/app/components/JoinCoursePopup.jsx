"use client"
import { useState } from 'react';
import styles from '../styles/JoinCoursePopup.module.css';
import useFormationStore from '../stores/formationStore';
import useAuthStore from '../stores/authStore';

const JoinCoursePopup = ({ onClose }) => {
  const [courseCode, setCourseCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { enrollFormationByCode } = useFormationStore();
  const { user } = useAuthStore();

  const handleJoinCourse = async () => {
    console.log(courseCode);
    if (!courseCode.trim()) {
      setError('Please enter a course code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await enrollFormationByCode(courseCode, user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinCourse();
    }
  };

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
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            onKeyPress={handleKeyPress}
            required
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        <button 
          className={styles.joinButton} 
          onClick={handleJoinCourse}
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join Course'}
        </button>
      </div>
    </div>
  );
};

export default JoinCoursePopup;