import { React, useState, useEffect, useContext } from 'react';
import styles from './History.module.css';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import html2pdf from 'html2pdf.js';

const History = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoader(true);
      try {
        const results = await axios.get(`/api/resume/get/${userInfo._id}`);
        // Reverse so latest is first
        setData(results.data.resumes.reverse());
      } catch (err) {
        console.log(err);
        alert("Error fetching history data. Please try again later.");
      } finally {
        setLoader(false);
      }
    }
    fetchUserData();
  }, []);

  const handleDownloadPDF = (item) => {
    const element = document.createElement('div');
    element.innerHTML = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #1e293b;">
            <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px;">
                <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">AI Resume Analysis Report</h1>
                <p style="color: #64748b; margin-top: 8px; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <table style="width: 100%; margin-bottom: 32px; font-size: 15px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f8fafc;">
                    <td style="padding: 12px 0; color: #64748b; width: 140px; font-weight: 500;">Candidate File</td>
                    <td style="padding: 12px 0; font-weight: 600; color: #0f172a;">${item.resume_name.replace('.pdf', '')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f8fafc;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 500;">Analysis Date</td>
                    <td style="padding: 12px 0; font-weight: 600; color: #0f172a;">${item.createdAt.slice(0, 10)}</td>
                </tr>
                <tr>
                    <td style="padding: 20px 0; color: #64748b; font-weight: 500; vertical-align: middle;">Overall Score</td>
                    <td style="padding: 20px 0;">
                        <span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 6px 16px; border-radius: 24px; font-weight: 700; font-size: 16px;">
                            ${item.score}% Match
                        </span>
                    </td>
                </tr>
            </table>

            <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
                <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Detailed Feedback</h3>
                <p style="line-height: 1.7; color: #334155; font-size: 14px; margin-bottom: 0;">
                    ${item.feedback.replace(/\n/g, '<br/>')}
                </p>
            </div>
        </div>
    `;

    const opt = {
        margin: 0,
        filename: `${item.resume_name.replace('.pdf', '')}_Analysis.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={styles.History}>
      <div className={styles.pageHeader}>
        <div className={styles.badge}>Your Archive</div>
        <h1 className={styles.pageTitle}>Analysis History</h1>
        <p className={styles.pageSubtitle}>Review your past resume screenings and download detailed reports.</p>
      </div>

      <div className={styles.HistoryCardBlock}>
        {loader && (
          Array.from(new Array(6)).map((_, index) => (
            <Skeleton key={index} variant="rectangular" sx={{ borderRadius: "20px" }} width="100%" height={280} />
          ))
        )}

        {!loader && data.length === 0 && (
           <div className={styles.noData}>
               <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, color: "#cbd5e1", marginBottom: "12px" }} />
               <h3>No history found</h3>
               <p>Start analyzing resumes from your dashboard.</p>
           </div>
        )}

        {!loader && data.map((item) => {
          return (
            <div key={item._id} className={styles.HistoryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.scoreBlock}>
                  <AutoAwesomeIcon sx={{ color: "#4f46e5", fontSize: 18 }} />
                  <span className={styles.cardPercentage}>{item.score}%</span>
                  <span className={styles.matchText}>Match</span>
                </div>
                <div className={styles.dateBlock}>
                  <EventNoteOutlinedIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.resumeName}>
                  <div className={styles.iconWrapper}>
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                  </div>
                  <span className={styles.truncateText}>{item.resume_name}</span>
                </div>
                
                <div className={styles.feedbackSection}>
                  <h4>Analysis Feedback</h4>
                  <p className={styles.customScrollbar}>{item.feedback}</p>
                </div>

                <button 
                  className={styles.downloadBtn} 
                  onClick={() => handleDownloadPDF(item)}
                >
                  <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />
                  Export Report
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WithAuthHOC(History);