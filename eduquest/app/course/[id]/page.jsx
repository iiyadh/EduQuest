"use client"
import { useEffect, useState } from 'react';
import useCoursesStore from '../../stores/coursesStore';
import styles from '../../styles/CourseDetail.module.css';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

const CoursePage = () => {
  const params = useParams();
  const { id } = params;
  const { courses, enrolledCourses, enrollInCourse, markLastPoint ,calculateProgress} = useCoursesStore();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson,setActiveLesson] = useState("");

  useEffect(() => {
    if (id && courses.length) {
      const foundCourse = courses.find(c => c.id === id);
      setCourse(foundCourse);
      setIsEnrolled(enrolledCourses.includes(id));
      
      if (foundCourse?.modules?.length && activeModule === null) {
        setActiveModule(foundCourse.modules[0]);
      }
      
      const savedProgress = calculateProgress(id);
      setProgress(savedProgress ? parseInt(savedProgress) : 0);
    }
  }, [id, courses, enrolledCourses]);

  const handleEnroll = () => {
    enrollInCourse(id);
    setIsEnrolled(true);
  };

  const handleLessonComplete = (lessonId) => {

    markLastPoint(id,lessonId);
    if(lessonId === activeLesson){
      setActiveLesson("");
      return;
    }
    setActiveLesson(lessonId);
    const newProgress = calculateProgress(id);
    setProgress(newProgress);
  };

  if (!course) {
    return <div className={styles.loading}>Loading course...</div>;
  }

  return (
    <div className={styles.courseContainer}>
      <Link href="/home">
      <button className={styles.goBackbtn}>
      ← Go Back
      </button>
      </Link>
      <div className={styles.courseHeader}>
        <div className={styles.courseMeta}>
          <span className={`${styles.levelBadge} ${styles[course.level.toLowerCase()]}`}>
            {course.level}
          </span>
          <span className={styles.duration}>{course.duration}</span>
        </div>
        <h1 className={styles.courseTitle}>{course.title}</h1>
        <p className={styles.courseDescription}>{course.description}</p>
        
        {!isEnrolled ? (
          <button onClick={handleEnroll} className={styles.enrollButton}>
            Enroll in Course
          </button>
        ) : (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}% Complete</span>
          </div>
        )}
      </div>

      {isEnrolled && (
        <div className={styles.courseContent}>
          <div className={styles.modulesSidebar}>
            <h3>Modules</h3>
            <ul className={styles.moduleList}>
              {course.modules.map(module => (
                <li 
                  key={module.id}
                  className={`${styles.moduleItem} ${activeModule?.id === module.id ? styles.active : ''}`}
                  onClick={() => setActiveModule(module)}
                >
                  {module.title}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.lessonsContainer}>
            {activeModule && (
              <>
                <h2 className={styles.moduleTitle}>{activeModule.title}</h2>
                <ul className={styles.lessonList}>
                  {activeModule.lessons.map(lesson => (
                    <li key={lesson.id} className={styles.lessonItem}>
                      <div className={styles.lessonContent}>
                        <h3>{lesson.title}</h3>
                        <button 
                          onClick={() => handleLessonComplete(lesson.id)}
                          className={styles.completeButton}
                        >
                         {activeLesson === lesson.id ? <p>↑</p>:<p>↓</p>} 
                        </button>
                      </div>
                      {activeLesson === lesson.id  && <ReactMarkdown>
                          {lesson.content}
                        </ReactMarkdown>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;