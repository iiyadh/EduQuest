"use client"
import { useEffect,useState  } from "react";
import styles from "../styles/Profile.module.css"
import axios from "axios";
import useAuthStore from "../stores/authStore";
import useFormationStore from "../stores/formationStore";

const HomeComp = ()=>{

  axios.defaults.baseURL = "http://127.0.0.1:8000";

  const [courses,setCourses] = useState([]);
  const {user} = useAuthStore();

  const {myFormations,enrollFormation,fetchMyFormations} = useFormationStore();





  useEffect(()=>{
    const fetchAllcourses = async()=>{
      try{
        const res = await axios.get(`/student/formations/${user.id.departmentId}`);
        let filteredCourses = res.data.filter(course => 
          !myFormations.some(myFormation => myFormation._id === course._id)
        );
        setCourses(filteredCourses);
        console.log(res.data);
      }catch(err){
        console.log(err.response.data.message);
      }
    }
    fetchMyFormations();
    fetchAllcourses();
  },[])


  

  const handleSubscribe = (course) => {
    enrollFormation(course,user);
    setCourses(prevCourses => prevCourses.filter(courseItem => courseItem._id !== course._id));
  }


    return (
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
              <button className={`${styles.actionButton} ${styles.subscribeButton}`} onClick={()=>handleSubscribe(course)}>Subscribe</button>
            </div>
          </div>
        ))}
        {courses.length === 0 && <h1>Nothing Is Here</h1>}
      </div>
    )
}

export default HomeComp;