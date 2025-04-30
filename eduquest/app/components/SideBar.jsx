"use client"
import React from 'react';
import  useCoursesStore  from '../stores/coursesStore';
import styles from '../styles/Sidebar.module.css';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const { enrolledCourses, courses,calculateProgress  } = useCoursesStore();
  const router = useRouter();

  const enrolledCoursesWithProgress = enrolledCourses.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    return {
      ...course,
      progress: Math.round(calculateProgress(courseId)),
      nextLesson: course?.modules?.[0]?.lessons?.[0]?.title || "No lessons available"
    };
  });

  const handleGotoCourse = (id)=>{
    console.log(id);
    router.push(`/course/${id}`);
  }


  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h2 className={styles.sidebarTitle}>My Courses</h2>
        <ul className={styles.sidebarCourses}>
          {enrolledCoursesWithProgress.map(course => (
            <li key={course.id} className={styles.sidebarCourseItem} onClick={()=>handleGotoCourse(course.id)}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{course.progress}%</span>
              </div>
              <div className={styles.nextLesson}>
                <span>Next: {course.nextLesson}</span>
              </div>
            </li>
          ))}
          {enrolledCoursesWithProgress.length === 0 && (
            <li className={styles.sidebarNothing}>No enrolled courses</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;