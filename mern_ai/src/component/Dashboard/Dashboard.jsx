import React, { useContext, useState } from 'react';
import styles from './Dashboard.module.css';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Dashboard = () => {
  const [uploadFileText, setUploadFileText] = useState("Click to browse or drag PDF here");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  const { userInfo } = useContext(AuthContext);

  const handleOnChangeFile = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setUploadFileText(e.target.files[0].name);
    }
  }

  const handleUpload = async () => {
    setResult(null);
    if (!jobDesc || !resumeFile) {
      alert("Please upload resume and paste job description before analyzing");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_desc", jobDesc);
    formData.append("user", userInfo._id);

    setLoading(true);

    try {
      const result = await axios.post('/api/resume/addResume', formData);
      setResult(result.data.data);
    } catch (err) {
      console.log(err);
      alert("Error analyzing resume. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.Dashboard}>
      <div className={styles.DashboardLeft}>
        <div className={styles.DashboardHeader}>
          <div className={styles.badge}>Powered by AI</div>
          <div className={styles.DashboardHeaderLargeTitle}>Smart Resume Screening</div>
          <p className={styles.subtitle}>Upload your resume and the target job description to get deep, actionable insights.</p>
        </div>

        {/* Premium Soft Alert Box */}
        <div className={styles.alertInfo}>
          <div className={styles.alertHeader}>
            <InfoOutlinedIcon sx={{ fontSize: 20 }} />
            Instructions
          </div>
          <ul className={styles.dashboardInstruction}>
            <li>Please paste the complete job description in the text field below.</li>
            <li>Currently, only PDF format (.pdf) resumes are accepted by the analyzer.</li>
          </ul>
        </div>

        {/* Modern Interactive Drop Zone */}
        <div className={styles.uploadSection}>
          <label htmlFor="inputField" className={styles.dropZone}>
            <div className={styles.dropZoneIconWrapper}>
              <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: "#4f46e5" }} />
            </div>
            <div className={styles.dropZoneText}>{uploadFileText}</div>
            <div className={styles.dropZoneSubtext}>PDF up to 5MB</div>
          </label>
          <input type="file" accept=".pdf" id="inputField" onChange={handleOnChangeFile} />
        </div>

        {/* Sleek Input Area */}
        <div className={styles.jobDesc}>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Job Description</label>
            <textarea 
              value={jobDesc} 
              onChange={(e) => setJobDesc(e.target.value)} 
              className={styles.textArea} 
              placeholder='e.g. We are looking for a Software Engineer with 3+ years of experience...' 
              rows={6} 
            />
          </div>
          <button className={styles.AnalyzeBtn} onClick={handleUpload} disabled={loading}>
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
            {loading ? "Analyzing Profile..." : "Analyze Match"}
          </button>
        </div>
      </div>

      {/* Right side Profile & Results */}
      <div className={styles.DashboardRight}>
        <div className={styles.DashboardRightTopCard}>
          <div className={styles.cardTitle}>Profile Overview</div>
          <div className={styles.profileWrapper}>
            <img
              className={styles.profileImg}
              src={userInfo?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="User Profile"
            />
          </div>
          <h2 className={styles.userName}>{userInfo?.name}</h2>
          <p className={styles.userEmail}>{userInfo?.email}</p>
        </div>

        {loading && (
          <div className={styles.skeletonCard}>
            <Skeleton variant="rectangular" animation="wave" sx={{ borderRadius: "20px" }} width="100%" height={320} />
          </div>
        )}

        {result && !loading && (
          <div className={styles.ResultCard}>
            <div className={styles.cardTitle}>AI Match Result</div>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreInner}>
                <h1>{result?.score}%</h1>
                <span>Match</span>
              </div>
            </div>
            <div className={styles.feedback}>
              <h3>Detailed Feedback</h3>
              <p>{result?.feedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WithAuthHOC(Dashboard);