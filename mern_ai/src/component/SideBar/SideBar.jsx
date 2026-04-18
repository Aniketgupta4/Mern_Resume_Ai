import React, { useContext } from 'react';
import styles from './SideBar.module.css';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.clear();
    setLogin(false);
    setUserInfo(null);
    navigate('/');
  };

  return (
    <div className={styles.sideBar}>
      {/* Top Logo Section */}
      <div className={styles.sideBarIcon}>
        <div className={styles.logoCircle}>
          <ArticleIcon sx={{ fontSize: 32, color: "#fff" }} />
        </div>
        <div className={styles.sideBarTopContent}>Resume AI</div>
      </div>

      {/* Navigation Options - Pura Ek Block Bana Diya */}
      <div className={styles.sideBarOptionsBlock}>
        <Link 
          to="/dashboard" 
          className={`${styles.sideBarOption} ${location.pathname === '/dashboard' ? styles.selectedOption : ''}`}
        >
          <DashboardIcon sx={{ fontSize: 24 }} />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/history" 
          className={`${styles.sideBarOption} ${location.pathname === '/history' ? styles.selectedOption : ''}`}
        >
          <ManageSearchIcon sx={{ fontSize: 24 }} /> 
          <span>History</span>
        </Link>

        {userInfo?.role === "admin" && (
          <Link 
            to="/admin" 
            className={`${styles.sideBarOption} ${location.pathname === '/admin' ? styles.selectedOption : ''}`}
          >
            <AdminPanelSettingsIcon sx={{ fontSize: 24 }} /> 
            <span>Admin</span>
          </Link>
        )}

        {/* Logout Button Ab Isi Flex Block Ke Andar Hai */}
        <div onClick={handleLogout} className={`${styles.sideBarOption} ${styles.logoutOption}`}>
          <LogoutIcon sx={{ fontSize: 24 }} /> 
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;