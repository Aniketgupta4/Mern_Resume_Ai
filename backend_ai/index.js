const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
// PORT ko process.env.PORT dena zaroori hai Render ke liye
const PORT = process.env.PORT || 4000; 

require('./conn');

app.use(express.json());

// CORS mein local aur Render dono links daal di hain
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:5173', 
    'https://mern-resume-ai.onrender.com' 
  ] 
}));

const UserRoutes = require('./routes/user');
const ResumeRoutes = require('./routes/resume');

// --- 1. API ROUTES (Yeh pehle aane chahiye) ---
app.use('/api/user', UserRoutes);
app.use('/api/resume', ResumeRoutes);

// --- 2. FRONTEND SERVING LOGIC (Yeh hamesha aakhiri mein aana chahiye) ---
// Frontend ki build file ka rasta
const frontendDistPath = path.join(__dirname, '../mern_ai/dist');

// Backend ko bolo ki in files ko public karde
app.use(express.static(frontendDistPath));

// Agar user kisi bhi URL par jaye (jo api route na ho), toh React ka index.html dikhao
// SAHI (Yeh sab versions mein mast chalega)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});