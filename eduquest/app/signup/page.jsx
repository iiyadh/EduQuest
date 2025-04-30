"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../stores/authStore';

export default function SignUp() {
  axios.defaults.baseURL = "http://127.0.0.1:8000";

  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [departments,setDepartements] = useState([
    {name:"Computer Science", _id:"1"},
    {name:"Information Technology", _id:"2"},
    {name:"Software Engineering", _id:"3"},
    {name:"Data Science", _id:"4"},
    {name:"Cyber Security", _id:"5"},
    {name:"Artificial Intelligence", _id:"6"},
    {name:"Web Development", _id:"7"},
    {name:"Mobile Development", _id:"8"}
  ]);
  const router = useRouter();

  const {register,checkAuth} = useAuthStore();
  

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
    register(formData);
    router.push('/home');
  };

  useEffect(()=>{
    if(checkAuth()){
      router.push('/home');
    }
  },[])

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