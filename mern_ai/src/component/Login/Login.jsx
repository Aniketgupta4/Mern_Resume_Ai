import React, { useContext } from 'react';
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';
import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {
    // isLogin state nikal diya kyunki wo is component mein use nahi ho raha tha
    const { setLogin, setUserInfo } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            };

            await axios.post('api/user',userData).then((response)=>{
                setUserInfo(response.data.user);
                localStorage.setItem('userInfo', JSON.stringify(response.data.user)); 
            }).catch((err)=>{
                console.error("Error during user registration/login:", err);
            });


            setLogin(true);
            localStorage.setItem('isLogin', true);
            navigate('/dashboard');
            
        } catch (err) {
            alert('Something went wrong during login. Check console for details.'); 
            console.error("Firebase Login Error:", err);
        }
    };

    return (
        <div className={styles.Login}>
            {/* White theme applied via your Login.module.css */}
            <div className={styles.loginCard}>
                <div className={styles.loginCardTitle}>
                    <h1>Login</h1>
                    <VpnKeyIcon />
                </div>

                {/* Fixed onClick handler (Direct Reference) */}
                <div className={styles.googleBtn} onClick={handleLogin}>
                    <GoogleIcon sx={{ fontSize: 20, color: "red" }} /> 
                    Sign in with Google
                </div>
            </div>
        </div>
    );
};

export default Login;