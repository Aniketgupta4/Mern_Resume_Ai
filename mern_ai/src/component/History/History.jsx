import {React,useState,useEffect} from 'react'
import styles from './History.module.css'
import Skeleton from '@mui/material/Skeleton'
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {

  const [data,setData] = useState([]);
  const [loader,setLoader] = useState(false);

  const {userInfo} = useContext(AuthContext);

  useEffect(()=>{
    const fetchUserData = async() => {
     setLoader(true);
      try{
        const results = await axios.get(`/api/resume/get/${userInfo._id}`);
        setData(results.data.resumes);
        console.log(results);
      }catch(err){
        console.log(err);
        alert("Error fetching history data. Please try again later.");
      }finally{
        setLoader(false);
      }
    }
    fetchUserData();
    },[]);    

  return (
    <div className={styles.History}>
      <div className={styles.HistoryCardBlock}>
         
        {
          loader && <>
          
          <Skeleton variant="rectangular" sx={{borderRadius:"20px"}} width={280} height={280} />
          <Skeleton variant="rectangular" sx={{borderRadius:"20px"}} width={280} height={280} />
          <Skeleton variant="rectangular" sx={{borderRadius:"20px"}} width={280} height={280} />
          <Skeleton variant="rectangular" sx={{borderRadius:"20px"}} width={280} height={280} />
          
          
          </>
        } 


        {
          data.map((item,index)=>{
            return(
              <div key={item._id} className={styles.HistoryCard}>
             <div className={styles.cardPercentage}>{item.score}%</div>
             <p>Resume Name : {item.resume_name}</p>
             <p>{item.feedback}</p>
             <p>Dated : {item.createdAt.slice(0,10)}</p>
             </div>  
            )
          })
        } 


      </div>
    </div>
  )
}

export default WithAuthHOC(History)
