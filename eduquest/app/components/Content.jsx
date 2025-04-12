import React from 'react';
import styles from '../styles/UserHome.module.css';
import ContactPage from './Contact';
import ProfilePage from './Profile';
import HomeComp from './HomeComp';

const Content = ({section , setSection}) => {
    return (
        <>
        { !section && (
        <main className={styles.mainContent}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Transform Your Learning Experience</h1>
              <p>Join thousands of students advancing their careers with our interactive courses</p>
              <div className={styles.heroButtons}>
                <button onClick={()=>setSection("profile")} className={styles.primaryButton}>Browse Courses</button>
              </div>
            </div>
            <div className={styles.heroImage}>
              {/* Placeholder for hero image */}
            </div>
          </section>
    
          <section className={styles.features}>
            <h2>Why Choose EduQuest?</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📚</div>
                <h3>Expert-Led Courses</h3>
                <p>Learn from industry professionals with real-world experience</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔄</div>
                <h3>Flexible Learning</h3>
                <p>Study at your own pace, anytime, anywhere</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Practical Skills</h3>
                <p>Gain hands-on experience with projects and exercises</p>
              </div>
            </div>
          </section>
        </main>
        )}
        {section === "contact" && (<ContactPage/>)}
        {section === "profile" && (<ProfilePage/>)}
        {section === "home" && (<HomeComp/>)}
        </>
      );
};

export default Content;