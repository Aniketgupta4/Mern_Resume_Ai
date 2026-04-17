import {React,useContext,useState} from 'react'
import styles from './Dashboard.module.css'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
  
  const [uploadFileText,setUploadFileText] = useState("Upload Your Resume")
  const [loading,setLoading] = useState(false);
  const [resumeFile,setResumeFile] = useState(null);
  const [jobDesc,setJobDesc] = useState("");
  const [result,setResult] = useState(null);

  const {userInfo} = useContext(AuthContext);

  const handleOnChangeFile = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadFileText(e.target.files[0].name);
  }

  const handleUpload = async() => {
    setResult(null);
    if(!jobDesc || !resumeFile){
      alert("Please upload resume and paste job description before analyzing");
      return;
    }
    const formData = new FormData();
    formData.append("resume",resumeFile);
    formData.append("job_desc",jobDesc);
    formData.append("user",userInfo._id);

    setLoading(true);

    try{
      const result = await axios.post('/api/resume/addResume',formData);
      console.log(result.data);
      setResult(result.data.data);
    }catch(err){
      console.log(err);
      alert("Error analyzing resume. Please try again later.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className={styles.Dashboard}>
        <div className={styles.DashboardLeft}>
          <div className={styles.DashboardHeader}>
             <div className={styles.DashboardHeaderTitle}>Smart Resume Screening</div>
             <div className={styles.DashboardHeaderLargeTitle}>Resume Match Score</div>
          </div>

            <div className={styles.alertInfo}>
                <div>⚠️ Important Instructions :</div>
                <div className={styles.dashboardInstruction}>
                    <div>📄 Please paste the complete job description in the "Job Description" field before submitting.</div>
                    <div>📑 Only PDF format (.pdf) resumes are accepted.</div>
                </div>
            </div>

            <div className={styles.DashboardUploadResume}>
                <div className={styles.DashboardResumeBlock}>
                    {uploadFileText}
                </div>
                <div className={styles.DashboardInputField}>
                    <label htmlFor="inputField" className={styles.analyzeAIBtn}>Upload Resume</label>
                    <input type="file" accept=".pdf" id="inputField" onChange={handleOnChangeFile} />
                </div>
            </div>

            <div className={styles.jobDesc}>
                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} className={styles.textArea} placeholder='Paste Your Job Description' rows={10} cols={50} />
                <div className={styles.AnalyzeBtn} onClick={handleUpload}>Analyze</div>
            </div>

        </div>


    <div className={styles.DashboardRight}>
      <div className={styles.DashboardRightTopCard}>
        <div>Analyze With AI</div>

          <img 
    className={styles.profileImg} 
    src={userInfo?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
    alt="User Profile" 
/>
          
          <h2>{userInfo?.name}</h2>

      </div>

      
          {
         <div className={styles.DashboardRightTopCard}>
        <div>Result</div>

          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20}}>
            <h1>{result?.score}%</h1>
            <CreditScoreIcon sx={{ fontSize: "22" }}/>
          </div>

          <div className={styles.feedback}>
             <h3>Feedback</h3>
             <p>{result?.feedback}</p>
          </div>
        </div>   
          }


          {
            loading && <Skeleton variant="rectangular" sx={{borderRadius:"20px"}} width={280} height={280} />
          }

    </div> 
    </div>
    

  )
}

export default WithAuthHOC(Dashboard)
