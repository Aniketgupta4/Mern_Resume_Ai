// const ResumeModel = require('../Modals/resume');
// const pdfParse = require('pdf-parse');
// const {CohereClient} = require('cohere-ai');
// const multer = require('multer');
// const path = require('path');

// const cohere = new CohereClient({
//     token: "K8NwSe0aElorDiYNIkruXYt2ir9Vcp3K8t2WVA6U"
// });


// exports.addResume = async(req,res)=>{
//     try{
//         const {job_desc,user} = req.body;
//         // console.log(req.file);
//         // console.log(job_desc,user);

//         const pdfBuffer = req.file.buffer || null;
//         const pdfPath = req.file.path;
//         const fs = require('fs');
//         const dataBuffer = fs.readFileSync(pdfPath);
//         const pdfData = await pdfParse(dataBuffer);
//         console.log(pdfData.text);


//        const prompt = `
//             You are a resume screening assistant.
//             Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and briefly explain the missing skills.

//             Resume:
//             ${pdfData.text}

//             Job Description:
//             ${job_desc}

//             Return the score and a brief explanation in this format:
//             Score: XX
//             Reason: ...

//         `;

//         const response = await cohere.generate({
//             model: 'command-a-03-2025',
//             prompt: prompt,
//             max_tokens: 100,
//             temperature: 0.7,
//         })

//         let result = response.body.generations[0].text;
//         // console.log(result);

//         const match = result.match(/Score:\s*(\d+)/);
//         const score = match ? parseInt(match[1] ,10):null;

//         const reasonMatch = result.match(/Reason:\s*([\s\S]+)/);
//         const reason = reasonMatch ? reasonMatch[1].trim() : null;

//         const newResume = new ResumeModel({
//             user,
//             resume_name:req.file.originalname,
//             job_desc,
//             score,
//             feedback:reason
//         });

//         await newResume.save();
//         fs.unlinkSync(pdfPath);
//         res.status(200).json({"message":"Resume added successfully",data:newResume});

//     }catch(err){
//         console.log(err)
//         res.status(500).json({"message":"error registering user","error":err})
//     }
// }




const ResumeModel = require('../Modals/resume');
const { PDFParse } = require('pdf-parse'); 
const fs = require('fs');

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;

        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }

        const pdfPath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfPath);

        // 2. Parse PDF (Naye version ke hisaab se)
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();

        const prompt = `
            You are a resume screening assistant.
            Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and briefly explain the missing skills.

            Resume:
            ${pdfData.text}

            Job Description:
            ${job_desc}

            Return the score and a brief explanation in this format:
            Score: XX
            Reason: ...
        `;

        // 3. Cohere API Call (v2 Chat API using Native Fetch)
        const response = await fetch('https://api.cohere.com/v2/chat', {
            method: 'POST',
            headers: {
                // ⚠️ Dhyan do: Apna token baad me .env me move kar lena security ke liye
                'Authorization': 'Bearer K8NwSe0aElorDiYNIkruXYt2ir9Vcp3K8t2WVA6U', 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: 'command-a-03-2025', // Cohere v2 ka working model
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // Agar API error de toh yahin pakad lenge
        if (!response.ok) {
            throw new Error(`Cohere API Error: ${data.message || JSON.stringify(data)}`);
        }

        // 4. Response Nikalna
        const result = data.message.content[0].text; 
        console.log("AI Response Success! Score generated:\n", result);

        // 5. Regex se Score aur Reason alag karna
        const match = result.match(/Score:\s*(\d+)/);
        const score = match ? parseInt(match[1], 10) : null;

        const reasonMatch = result.match(/Reason:\s*([\s\S]+)/);
        const reason = reasonMatch ? reasonMatch[1].trim() : null;

        // 6. MongoDB me save karna
        const newResume = new ResumeModel({
            user,
            resume_name: req.file.originalname,
            job_desc,
            score,
            feedback: reason
        });

        await newResume.save();
        
        // 7. Temporary PDF file ko uploads folder se delete karna
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath); 
        }
        
        // 8. Success Response Frontend/Postman ko bhejna
        res.status(200).json({ 
            message: "Resume added successfully", 
            data: newResume 
        });

    } catch (err) {
        console.error("🔥 Error in addResume:", err);
        res.status(500).json({ message: "error processing resume", error: err.message });
    }
};




exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        
        // Find all resumes for this user and sort them by newest first (-1)
        let resumes = await ResumeModel.find({ user: user }).sort({ createdAt: -1 });
        
        // Send the fetched resumes to the frontend
        return res.status(200).json({ message:"your previous history",resumes:resumes });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};




exports.getResumeForAdmin = async (req, res) => {
    try {
        // Find ALL resumes in the database (empty {} means no filter) and sort newest first
        let resumes = await ResumeModel.find({}).sort({ createdAt: -1 }).populate("user");
        
        return res.status(200).json({ message: "Fetched All History", resumes: resumes });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};
