import { React, useState, useEffect } from 'react';
import styles from './Admin.module.css';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';

const Admin = () => {
   const [data, setData] = useState([]);
   const [loader, setLoader] = useState(false);

   useEffect(() => {
    const fetchAllData = async () => {
      setLoader(true);
      try {
        const results = await axios.get('/api/resume/get');
        // Latest resumes pehle dikhane ke liye reverse kar diya
        setData(results.data.resumes.reverse());
      } catch (err) {
        console.log(err);
        alert("Error fetching admin data. Please try again later.");
      } finally {
        setLoader(false);
      }
    }  
    fetchAllData();
   }, []);

   // Score ke hisaab se color return karne ka function
   const getScoreColor = (score) => {
       if(score >= 80) return styles.scoreHigh;
       if(score >= 50) return styles.scoreMedium;
       return styles.scoreLow;
   };

  return (
    <div className={styles.Admin}>
      {/* Premium Admin Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTitleBlock}>
            <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#2563eb" }} />
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        </div>
        <p className={styles.pageSubtitle}>Overview of all candidate resume analyses across the platform</p>
      </div>

      <div className={styles.AdminBlock}>
        {
          loader && (
            Array.from(new Array(8)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" sx={{ borderRadius: "24px" }} width="100%" height={280} />
            ))
          )
        }
        
        {!loader && data.length === 0 && (
           <div className={styles.noData}>No records found in the database.</div>
        )}

        {
          !loader && data.map((item) => {
            return (
                // Added missing key prop
                <div key={item._id} className={styles.AdminCard}>
                    
                    {/* User Info Section */}
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {/* Naam ka pehla letter avatar me dikhane ke liye */}
                            {item?.user?.name ? item.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className={styles.userDetails}>
                            <h2>{item?.user?.name || "Unknown User"}</h2>
                            <div className={styles.emailBlock}>
                                <EmailIcon sx={{ fontSize: 14, color: "#64748b" }} />
                                <span>{item?.user?.email || "No email provided"}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Score Section with Dynamic Colors */}
                    <div className={`${styles.scoreSection} ${getScoreColor(item?.score)}`}>
                        <div className={styles.scoreLabel}>
                            <SpeedIcon sx={{ fontSize: 18 }} />
                            <span>AI Match Score</span>
                        </div>
                        <div className={styles.scoreValue}>{item?.score || 0}%</div>
                    </div>

                    {/* Feedback Section */}
                    <div className={styles.feedbackSection}>
                        <h4>Analysis Feedback</h4>
                        <p>{item?.feedback}</p>
                    </div>

                </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default WithAuthHOC(Admin);