"use client"
import { useEffect ,useState} from 'react';
import styles from '../styles/Profile.module.css';
import useAuthStore from '../stores/authStore';
import axios from 'axios';
import useFormationStore from '../stores/formationStore';

const ProfilePage = ({ setSection}) => {


  axios.defaults.baseURL = "http://127.0.0.1:8000";


  const  { myFormations ,fetchMyFormations ,quitFormation}  = useFormationStore();

  const {user} = useAuthStore();
  const [userData,setUserData] = useState({});
  // Set animation delays for course cards
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.courseCard}`);
    cards.forEach((card, index) => {
      card.style.setProperty('--order', index);
    });


    const fetchUserData = async ()=>{
      try{
        const res = await axios.get(`/student/${user.id._id}`);
        setUserData(res.data);
      }catch(err){
        console.log(err);
      }
    }

    fetchUserData();
    fetchMyFormations(user);
  }, []);


  const handleUnsub = (course)=>{
    quitFormation(course,user);
    window.location.href = "/home";
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.hero}>
        <h1>{userData.username}</h1>
        <p>
          Your journey to knowledge begins here. At EduQuest, we believe learning should be inspiring, 
          accessible, and tailored to your goals. Whether you're exploring new skills, diving deeper 
          into a subject, or preparing for a brighter future, our platform is designed to guide and 
          support you every step of the way. Let's turn curiosity into achievement—one course at a time.
        </p>
      </div>
      
      <div className={styles.coursesCards}>
        {myFormations.map((course) => (
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
              <button className={`${styles.actionButton} ${styles.viewButton}`} onClick={()=>setSection(course._id)}>View Course</button>
              <button className={`${styles.actionButton} ${styles.unsubscribeButton}`} onClick={()=>handleUnsub(course)}>Unsubscribe</button>
            </div>
          </div>
        ))}
        {myFormations.length === 0 &&
        (<h1>There is no courses yet</h1>)}
      </div>
    </div>
  );
};

export default ProfilePage;