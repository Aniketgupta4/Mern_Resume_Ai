import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mern-resume-ai.onrender.com', // Replace with your backend URL
});

export default instance;