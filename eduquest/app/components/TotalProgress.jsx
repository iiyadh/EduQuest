"use client"
import useCoursesStore from "../stores/coursesStore";
import styles from "../styles/ProgressOverview.module.css";

const TotalProgress = () => {
  const { enrolledCourses, courses,calculateProgress } = useCoursesStore();

  const enrolledCoursesWithProgress = enrolledCourses.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    return {
      ...course,
      progress: Math.round(calculateProgress(courseId))
    };
  });

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCoursesWithProgress.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length): 0;

  return (
    <div className={styles.progressContainer}>
      <h2 className={styles.progressTitle}>Overall Learning Progress</h2>
      <div className={styles.progressCircle}>
        <div 
          className={styles.circleBackground} 
          style={{ 
            background: `conic-gradient(#4CAF50 ${totalProgress}%, #e0e0e0 ${totalProgress}% 100%)`
          }}
        >
          <div className={styles.circleInner}>
            <span className={styles.progressPercent}>{Math.round(totalProgress)}%</span>
          </div>
        </div>
      </div>
      <div className={styles.progressStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{enrolledCourses.length}</span>
          <span className={styles.statLabel}>Courses</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {enrolledCoursesWithProgress.filter(c => c.progress === 100).length}
          </span>
          <span className={styles.statLabel}>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default TotalProgress;