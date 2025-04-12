"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from "../stores/authStore";
import styles from "../styles/UserHome.module.css";
import Navbar from '../components/NavBar';
import Sidebar from '../components/SideBar';
import Content from '../components/Content';
import JoinCoursePopup from '../components/JoinCoursePopup';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [section, setSection] = useState();
  const { user, isAuthenticated, checkAuth, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, []);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  

  return (
    <div className={styles.container}>
      <Navbar setShowPopup={setShowPopup} setSection={setSection} />
      <Sidebar />
      <Content section={section} setSection={setSection} />
      {showPopup && <JoinCoursePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Dashboard;