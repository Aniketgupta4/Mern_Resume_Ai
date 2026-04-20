const ResumeModel = require('../Modals/resume');
const { PDFParse } = require('pdf-parse'); 
const fs = require('fs');

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }

        const pdfPath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfPath);

        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();

       const prompt = `
You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter.
Your task is to critically evaluate the provided Resume against the provided Job Description (JD).

Provide a highly accurate match score (0-100) based on skills, experience, and qualifications.
Break down your analysis into clear, professional, and actionable sections.

Resume Text:
${pdfData.text}

Job Description:
${job_desc}

Return your analysis STRICTLY in the following format (do not use markdown bolding in headings):

Score: [Your Score here]%

🌟 Strong Matches (Pros):
- [Mention matched skill/experience 1]
- [Mention matched skill/experience 2]
- [Add more as needed]

⚠️ Areas for Improvement (Missing Skills/Gaps):
- [Mention missing skill/experience 1]
- [Mention missing skill/experience 2]
- [Add more as needed]

💡 Final Verdict:
[One brief sentence summarizing if the candidate is a strong, average, or weak fit for the role]
`;
        const response = await fetch('https://api.cohere.com/v2/chat', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer K8NwSe0aElorDiYNIkruXYt2ir9Vcp3K8t2WVA6U', 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: 'command-a-03-2025',
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

        if (!response.ok) {
            throw new Error(`Cohere API Error: ${data.message || JSON.stringify(data)}`);
        }

        const result = data.message.content[0].text; 

        const match = result.match(/Score:\s*\[?(\d+)/);
        const score = match ? parseInt(match[1], 10) : null;

        const feedbackLines = result.split('\n');
        const reason = feedbackLines.filter(line => !line.includes('Score:')).join('\n').trim();

        const newResume = new ResumeModel({
            user,
            resume_name: req.file.originalname,
            job_desc,
            score,
            feedback: reason
        });

        await newResume.save();
        
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath); 
        }
        
        res.status(200).json({ 
            message: "Resume added successfully", 
            data: newResume 
        });

    } catch (err) {
        console.error("🔥 Error in addResume:", err);
        res.status(500).json({ message: "error processing resume", error: err.message });
    }
};

// ==========================================
// HISTORY PAGINATION (LIMIT 5)
// ==========================================

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        
        // Frontend se page lo, default 1
        const page = parseInt(req.query.page) || 1;
        // Limit fix kar di hai 5 par
        const limit = 5; 
        const skip = (page - 1) * limit;

        const totalDocs = await ResumeModel.countDocuments({ user: user });
        const totalPages = Math.ceil(totalDocs / limit);

        // Sort -> Skip -> Limit ka order zaroori hai
        const resumes = await ResumeModel.find({ user: user })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        return res.status(200).json({ 
            resumes: resumes,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalDocs
        });

    } catch (err) {
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

// ==========================================
// ADMIN PAGINATION (Strict Limit 5)
// ==========================================
exports.getResumeForAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5; // Fix limit to 5
        const skip = (page - 1) * limit;

        const totalDocs = await ResumeModel.countDocuments({});
        const totalPages = Math.ceil(totalDocs / limit);

        // Population ke sath Skip aur Limit strictly lagaya hai
        const resumes = await ResumeModel.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email") // Optimized population
            .skip(skip)
            .limit(limit);
        
        // IMPORTANT: Response keys frontend se match karni chahiye
        return res.status(200).json({ 
            resumes: resumes,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalDocs
        });

    } catch (err) {
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};