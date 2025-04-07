"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignUp() {
  axios.defaults.baseURL = "http://127.0.0.1:8000";

  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [departments,setDepartements] = useState([]);
  const router = useRouter();


  useEffect(()=>{
    const fetchDep = async ()=>{
      try{
        const res = await axios.get("/student/departments");
        setDepartements(res.data);
      }catch(err){
        console.log(err);
      }
    }
    fetchDep();
  },[]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    departmentId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if(confirmedPassword !== formData.password){
        setErrorMsg("Password Not Match !!!");
        return;
      }
      const res = await axios.post("/student/register",formData);
      if (res.status === 200) {
        console.log("Register successful:", res.data);
        router.push("/login");
      }
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };

  return (
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.logo}>
            <span className={styles.logoPart1}>Edu</span>
            <span className={styles.logoPart2}>Quest</span>
          </div>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Join thousands of learners worldwide</p>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Create a password"
                required
                minLength="8"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmedPassword"
                name="confirmedPassword"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm your password"
                required
                minLength="8"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="departmentId" className={styles.label}>Department</label>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.department}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Select your department</option>
                {departments.map(dep=>{
                  return <option key={dep._id} value={dep._id}>{dep.name}</option>
                })}
                {/* <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Other">Other</option> */}
              </select>
            </div>

            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>

          <p className={styles.loginPrompt}>
            Already have an account? <Link href="/login" className={styles.loginLink}>Log in</Link>
          </p>
        </div>
      </div>
  );
}