import React from 'react';
import styles from '../styles/UserHome.module.css';

const Sidebar = () => {

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

  
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>My Courses</h2>
        <ul className={styles.sidebarLinks}>
          {courses.map(course => (
            <li key={course._id}><a href="#" className={styles.sidebarLink}>{course.title}</a></li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;