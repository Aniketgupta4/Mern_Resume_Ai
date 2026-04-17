import {React,useState,useEffect} from 'react';
import styles from './Admin.module.css';
import Skeleton from '@mui/material/Skeleton'
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';

const Admin = () => {

   const [data,setData] = useState([]);
   const [loader,setLoader] = useState(false);


   useEffect(()=>{

    const fetchAllData = async() => {
      setLoader(true);
      try{

        const results = await axios.get('/api/resume/get');
        setData(results.data.resumes);

      }catch(err){
        console.log(err);
        alert("Error fetching admin data. Please try again later.");
      }finally{
        setLoader(false);
      }
    
    }  

    fetchAllData()
   },[])

  return (
    <div className={styles.Admin}>
      <div className={styles.AdminBlock}>
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
        <div className={styles.AdminCard}>
             <h2>{item?.user?.name}</h2>
             <p style={{color: 'blue'}}>{item?.user?.email}</p>
             <p>Score : {item?.score}%</p>
             <p>{item?.feedback}</p>
        </div>
            )
          })
        }

    
      </div>
    </div>
  )
}

export default WithAuthHOC(Admin)    