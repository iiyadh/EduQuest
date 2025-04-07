"use client"
import { useEffect, useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBar';
import styles from '../styles/UserHome.module.css';
import  JoinCoursePopup from "../components/JoinCoursePopup";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [section,setSection] = useState();


  return (
    <div className={styles.container}>
      <Navbar
      setShowPopup={setShowPopup}
      setSection={setSection}
      />
      <Sidebar/>
      <Content 
      section={section}
      />
      {showPopup && <JoinCoursePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Dashboard;