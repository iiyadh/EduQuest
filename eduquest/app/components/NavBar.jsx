import styles from '../styles/UserHome.module.css';
import Link from 'next/link';
import Image from 'next/image';
import HomeIcon from '../../public/home-1-svgrepo-com.svg';
import FileIcon from '../../public/add-svgrepo-com.svg';
import ProfileIcon from '../../public/profile-round-1346-svgrepo-com.svg';
import ContactIcon from '../../public/contact-us-svgrepo-com.svg';
import LogoutIcon from '../../public/logout-svgrepo-com.svg';
import useAuthStore from '../stores/authStore';
import { useRouter } from 'next/navigation';

const Navbar = ({setShowPopup,setSection})=>{

  const { logout } = useAuthStore();
  const router = useRouter();



  const handleLogout = () =>{
    logout();
    router.push('/login');

  }
    return(
        <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>
            <Link href="/">EduQuest</Link>
          </h1>
          <nav className={styles.mainNav}>
            <ul className={styles.navList}>
              <li>
                <button onClick={()=>setSection("home")} className={styles.navLink}>
                  <Image src={HomeIcon} alt="Home" className='icons' width={20} height={20} />
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setShowPopup(true)} className={styles.navLink}>
                  <Image src={FileIcon} alt="Join Course" className='icons' width={20} height={20} />
                  Join Course
                </button>
              </li>
              <li>
                <button onClick={()=>setSection("profile")} className={styles.navLink}>
                  <Image src={ProfileIcon} alt="Profile" className='icons' width={20} height={20} />
                  Profile
                </button>
              </li>
              <li>
                <button onClick={()=>setSection("contact")} className={styles.navLink}>
                  <Image src={ContactIcon}  className='icons' alt="Contact" width={20} height={20} />
                  Contact
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.navLink}>
                  <Image src={LogoutIcon} alt="Logout" className='icons' width={20} height={20} />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
}

export default Navbar;