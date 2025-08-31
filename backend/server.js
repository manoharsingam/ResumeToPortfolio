// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const mongoose = require("mongoose");
// const OpenAI = require("openai");


// // Models
// const Portfolio = require("./models/Portfolio");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const upload = multer({ dest: "uploads/" });

// // OpenAI setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Route: Generate portfolio
// app.post("/generate-portfolio", upload.single("file"), async (req, res) => {
//   try {
//     const { template = "template1", level = "basic" } = req.body;

//     if (!req.file) return res.status(400).send("Resume file is required");

//     // Read PDF
//     const pdfBuffer = fs.readFileSync(req.file.path);
//     const pdfData = await pdfParse(pdfBuffer);
//     const resumeText = pdfData.text;

//     // Prompt for OpenAI
//     const prompt = `
//       Build a professional React + TailwindCSS portfolio website using this resume content:
//       ${resumeText}

//       Requirements:
//       - Template: ${template}, Level: ${level}
//       - Responsive for desktop & mobile
//       - Include sections: About, Skills, Projects, Contact
//       - Modern professional design like real developer portfolios
//       - All components and main App.jsx
//       - TailwindCSS for styling
//       - Ready-to-run React code
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const generatedCode = response.choices[0].message.content;

//     // Save in MongoDB
//     const portfolio = new Portfolio({
//       resumeText,
//       generatedCode,
//       template,
//       level,
//     });
//     await portfolio.save();

//     // Clean up uploaded file
//     fs.unlinkSync(req.file.path);

//     res.json({ code: generatedCode });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating portfolio");
//   }
// });

// // Fetch all portfolios
// app.get("/portfolios", async (req, res) => {
//   try {
//     const portfolios = await Portfolio.find().sort({ createdAt: -1 });
//     res.json(portfolios);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching portfolios");
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// gemini

require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Models
const Portfolio = require("./models/Portfolio");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route: Generate portfolio using Gemini
app.post("/generate-portfolio", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });

  const filePath = req.file.path;
  const { template = "template1", level = "basic" } = req.body;

  try {
    // 1. Read PDF
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // 2. Prepare prompt for Gemini
    const prompt = `
      Create a professional React + TailwindCSS portfolio using this resume content:
      --- RESUME START ---
      ${resumeText}
      --- RESUME END ---
      
      Requirements:
      1. Frameworks: React + TailwindCSS
      2. Single App.jsx file with components: Hero, About, Skills, Projects, Contact
      3. Fully responsive, modern, professional design
      4. Template: ${template}, Level: ${level}
      5. Provide only raw JSX code, no extra text
    `;

    // 3. Get the correct Gemini model
    // Replace 'models/chat-bison-001' with your actual model if different
    const model = genAI.getGenerativeModel({ model: "models/chat-bison-001" });

    // 4. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCode = response.text();

    // 5. Save to MongoDB
    const portfolio = new Portfolio({ resumeText, generatedCode, template, level });
    await portfolio.save();

    res.json({ code: generatedCode });

  } catch (err) {
    console.error("Error generating portfolio:", err);
    res.status(500).json({ message: "Error generating portfolio" });
  } finally {
    // 6. Clean up uploaded PDF
    fs.unlinkSync(filePath);
  }
});

// Route: Fetch all portfolios
app.get("/portfolios", async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching portfolios" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
