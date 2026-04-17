const express = require("express")
const cors = require("cors");
const app = express();
const PORT = 4000;

require('./conn')

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173' // Replace with your frontend URL
}));

const UserRoutes = require('./routes/user');
const ResumeRoutes = require('./routes/resume');

app.use('/api/user',UserRoutes);
app.use('/api/resume',ResumeRoutes);


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})