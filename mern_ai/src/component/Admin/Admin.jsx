import { React, useState, useEffect } from 'react';
import styles from './Admin.module.css';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import GroupOffOutlinedIcon from '@mui/icons-material/GroupOffOutlined';
// Pagination Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Admin = () => {
   const [data, setData] = useState([]);
   const [loader, setLoader] = useState(false);
   
   // Pagination States
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
    const fetchAllData = async () => {
      setLoader(true);
      try {
        // Backend ko page aur limit bhej rahe hain (Assume 8 items per page)
        const results = await axios.get(`/api/resume/get?page=${page}&limit=8`);
        
        // Data set kar rahe hain (Backend ab properly sort karke dega new API se)
        setData(results.data.resumes);
        
        // Total pages backend se aayega, agar nahi aaya toh default 1
        setTotalPages(results.data.totalPages || 1);
      } catch (err) {
        console.log(err);
        alert("Error fetching admin data. Please try again later.");
      } finally {
        setLoader(false);
      }
    }  
    fetchAllData();
   }, [page]); // Jab bhi 'page' change hoga, yeh API wapas call hogi

   // High-contrast dynamic score colors
   const getScoreColor = (score) => {
       if(score >= 80) return styles.scoreHigh;
       if(score >= 50) return styles.scoreMedium;
       return styles.scoreLow;
   };

   // Pagination Handlers
   const handlePrevPage = () => {
       if (page > 1) setPage(page - 1);
   };

   const handleNextPage = () => {
       if (page < totalPages) setPage(page + 1);
   };

  return (
    <div className={styles.Admin}>
      {/* Sleek, Modern Header matching Dashboard/History */}
      <div className={styles.pageHeader}>
        <div className={styles.badge}>System Control</div>
        <div className={styles.headerTitleBlock}>
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 40, color: "#0f172a" }} className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        </div>
        <p className={styles.pageSubtitle}>Monitor and manage all candidate AI resume analyses across the entire platform.</p>
      </div>

      <div className={styles.AdminBlock}>
        {
          loader && (
            Array.from(new Array(8)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" animation="wave" sx={{ borderRadius: "24px" }} width="100%" height={300} />
            ))
          )
        }
        
        {!loader && data.length === 0 && (
           <div className={styles.noData}>
               <GroupOffOutlinedIcon sx={{ fontSize: 48, color: "#cbd5e1", marginBottom: "12px" }} />
               <h3>No records found</h3>
               <p>The database is currently empty.</p>
           </div>
        )}

        {
          !loader && data.map((item) => {
            return (
                <div key={item._id} className={styles.AdminCard}>
                    
                    {/* User Info Section */}
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {item?.user?.name ? item.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className={styles.userDetails}>
                            <h2>{item?.user?.name || "Unknown Candidate"}</h2>
                            <div className={styles.emailBlock}>
                                <EmailOutlinedIcon sx={{ fontSize: 14, color: "#64748b" }} className={styles.emailIcon} />
                                <span>{item?.user?.email || "No email provided"}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Score Section */}
                    <div className={`${styles.scoreSection} ${getScoreColor(item?.score)}`}>
                        <div className={styles.scoreLabel}>
                            <SpeedOutlinedIcon sx={{ fontSize: 20 }} />
                            <span>AI Match Score</span>
                        </div>
                        <div className={styles.scoreValue}>{item?.score || 0}%</div>
                    </div>

                    {/* Feedback Section */}
                    <div className={styles.feedbackSection}>
                        <h4>Executive Summary</h4>
                        <p className={styles.customScrollbar}>{item?.feedback}</p>
                    </div>

                </div>
            )
          })
        }
      </div>

      {/* Premium Pagination UI */}
      {!loader && data.length > 0 && totalPages > 1 && (
        <div className={styles.paginationContainer}>
            <button 
                className={styles.pageBtn} 
                onClick={handlePrevPage} 
                disabled={page === 1}
            >
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                Prev
            </button>
            
            <div className={styles.pageInfo}>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>

            <button 
                className={styles.pageBtn} 
                onClick={handleNextPage} 
                disabled={page === totalPages}
            >
                Next
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </button>
        </div>
      )}

    </div>
  )
}

export default WithAuthHOC(Admin);