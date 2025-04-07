"use client"
import { useEffect } from 'react';
import styles from '../styles/Profile.module.css';

const ProfilePage = () => {
  const courses = [
    {
      _id: "67e981408c19b52381c7f85a",
      title: "Python Course",
      description: "Master Python programming from basics to advanced concepts including OOP, data structures, and algorithms.",
      theme: "PS",
      students: [],
      codeformation: "2AL08W"
    },
    {
      _id: "67e981408c19b52381c7f85b",
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript including variables, loops, functions, and DOM manipulation.",
      theme: "WD",
      students: [],
      codeformation: "3JS01A"
    },
    {
      _id: "67e981408c19b52381c7f85c",
      title: "Web Design with HTML & CSS",
      description: "Create beautiful, responsive websites with modern HTML5, CSS3, and Flexbox/Grid layouts.",
      theme: "WD",
      students: [],
      codeformation: "3WD02C"
    },
    {
      _id: "67e981408c19b52381c7f85d",
      title: "Data Structures in C++",
      description: "Understand core data structures such as arrays, linked lists, stacks, queues, and trees.",
      theme: "CS",
      students: [],
      codeformation: "4CS15B"
    },
    {
      _id: "67e981408c19b52381c7f85e",
      title: "Database Management Systems",
      description: "Explore relational databases, SQL queries, normalization, transactions, and indexing.",
      theme: "DB",
      students: [],
      codeformation: "5DB10D"
    }
  ];

  // Set animation delays for course cards
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.courseCard}`);
    cards.forEach((card, index) => {
      card.style.setProperty('--order', index);
    });
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.hero}>
        <h1>John Doe</h1>
        <p>
          Your journey to knowledge begins here. At EduQuest, we believe learning should be inspiring, 
          accessible, and tailored to your goals. Whether you're exploring new skills, diving deeper 
          into a subject, or preparing for a brighter future, our platform is designed to guide and 
          support you every step of the way. Let's turn curiosity into achievement—one course at a time.
        </p>
      </div>
      
      <div className={styles.coursesCards}>
        {courses.map((course) => (
          <div 
            key={course._id} 
            className={styles.courseCard}
            data-theme={course.theme}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className={styles.courseMeta}>
              <span>{course.codeformation}</span>
            </div>
            <div className={styles.actions}>
              <button className={`${styles.actionButton} ${styles.viewButton}`}>View Course</button>
              <button className={`${styles.actionButton} ${styles.unsubscribeButton}`}>Unsubscribe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;