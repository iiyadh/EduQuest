"use client"
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/CourseContent.module.css';
import axios from 'axios';

const CourseContent = ({section}) => {

    axios.defaults.baseURL = "http://127.0.0.1:8000";


    const [courseContent,setCourseContent] = useState({});
    const [loading,setLoading] = useState(false);


    useEffect(()=>{
        console.log(section);
        const fetchCourseContent = async ()=>{
            setLoading(true);
            try{
                const res = await axios.get(`/generate/${section}`);
                setCourseContent(res.data);
            }catch(err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourseContent();
    },[section])



  return (
    <>
    {!loading && <div className={styles.courseContentContainer}>
      <div className={styles.courseHeader}>
        <h1 className={styles.courseTitle}>{courseContent.title}</h1>
        <p className={styles.courseDescription}>{courseContent.description}</p>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.markdownContent}>
          <ReactMarkdown>{courseContent.content}</ReactMarkdown>
        </div>
      </div>
    </div>}
    {loading && 
        <h1 className={styles.loading}>Loading ... </h1>
    }
    </>
  );
};

export default CourseContent;