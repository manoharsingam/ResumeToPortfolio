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

// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const mongoose = require("mongoose");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Models
// const Portfolio = require("./models/Portfolio");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // ✅ Initialize Gemini AI (2.5)
// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not defined in the .env file");
// }
// const genAI = new GoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// /**
//  * Route: Generate portfolio using Gemini 2.5
//  */
// app.post("/generate-portfolio", upload.single("file"), async (req, res) => {
//   if (!req.file)
//     return res.status(400).json({ message: "Resume file is required" });

//   const filePath = req.file.path;
//   const { template = "template1", level = "basic" } = req.body;

//   try {
//     // 1. Read PDF file
//     const pdfBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(pdfBuffer);
//     const resumeText = pdfData.text;

//     // 2. Build prompt
//     const prompt = `
//       Create a professional React + TailwindCSS portfolio using this resume content:
//       --- RESUME START ---
//       ${resumeText}
//       --- RESUME END ---

//       Requirements:
//       1. Framework: React + TailwindCSS
//       2. Single App.jsx file with components: Hero, About, Skills, Projects, Contact
//       3. Fully responsive, modern, professional design
//       4. Template: ${template}, Level: ${level}
//       5. Return ONLY raw JSX code, no extra explanation.
//     `;

//     // 3. Use Gemini 2.5 model
//     // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


//     // 4. Generate portfolio code
//     const result = await model.generateContent(prompt);
//     const generatedCode = result.response.text();

//     // 5. Save to MongoDB
//     const portfolio = new Portfolio({
//       resumeText,
//       generatedCode,
//       template,
//       level,
//     });
//     await portfolio.save();

//     // 6. Send response
//     res.json({ code: generatedCode });
//   } catch (err) {
//     console.error("❌ Error generating portfolio:", err);
//     res.status(500).json({ message: "Error generating portfolio" });
//   } finally {
//     // 7. Clean up uploaded file
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//   }
// });

// /**
//  * Route: Fetch all portfolios
//  */
// app.get("/portfolios", async (req, res) => {
//   try {
//     const portfolios = await Portfolio.find().sort({ createdAt: -1 });
//     res.json(portfolios);
//   } catch (err) {
//     console.error("❌ Error fetching portfolios:", err);
//     res.status(500).json({ message: "Error fetching portfolios" });
//   }
// });

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




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
  console.error("GEMINI_API_KEY is not defined in the .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route: Generate portfolio using Gemini
app.post("/generate-portfolio", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: "Resume file is required" 
    });
  }

  const filePath = req.file.path;
  const { template = "template1", level = "basic" } = req.body;

  try {
    console.log("Processing file:", req.file.originalname);

    // 1. Read PDF
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    console.log("Resume text extracted, length:", resumeText.length);

    // 2. Prepare enhanced prompt for Gemini
    const prompt = `
Create a complete, professional HTML portfolio website using this resume content:

--- RESUME CONTENT ---
${resumeText}
--- END RESUME ---

Requirements:
1. Create a COMPLETE HTML file with inline CSS and JavaScript
2. Modern, responsive design that works on mobile and desktop
3. Professional color scheme and typography
4. Include these sections: Header/Hero, About, Skills, Experience, Projects, Education, Contact
5. Use CSS Grid/Flexbox for layout
6. Add smooth scrolling and hover effects
7. Template style: ${template}, Complexity: ${level}
8. Extract and format all information from the resume properly
9. Make it look like a real developer's portfolio website
10. Include a professional navigation menu

IMPORTANT: Return ONLY the complete HTML code with embedded CSS and JavaScript. No explanations or markdown formatting.
`;

    // 3. Use the correct Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Calling Gemini API...");

    // 4. Generate content with better parameters
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const response = await result.response;
    let generatedCode = response.text();

    // Clean up the generated code - remove any markdown formatting
    generatedCode = generatedCode
      .replace(/```jsx/g, '')
      .replace(/```javascript/g, '')
      .replace(/```react/g, '')
      .replace(/```js/g, '')
      .replace(/```/g, '')
      .trim();

    // Ensure proper React component structure
    if (!generatedCode.includes('import React')) {
      generatedCode = `import React from 'react';\n\n${generatedCode}`;
    }

    // Ensure it has proper export
    if (!generatedCode.includes('export default')) {
      generatedCode = generatedCode.replace('function App()', 'export default function App()');
    }

    console.log("Portfolio generated successfully, code length:", generatedCode.length);

    // 5. Save to MongoDB
    const portfolio = new Portfolio({ 
      resumeText, 
      generatedCode, 
      template, 
      level 
    });
    await portfolio.save();

    res.json({ 
      success: true, 
      code: generatedCode,
      message: "Portfolio generated successfully"
    });

  } catch (err) {
    console.error("Error generating portfolio:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error generating portfolio: " + err.message 
    });
  } finally {
    // 6. Clean up uploaded PDF
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// Route: Fetch all portfolios
app.get("/portfolios", async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .sort({ createdAt: -1 })
      .select('template level createdAt'); // Only send necessary fields
    
    res.json({ 
      success: true, 
      portfolios 
    });
  } catch (err) {
    console.error("Error fetching portfolios:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching portfolios" 
    });
  }
});

// Route: Get specific portfolio by ID
app.get("/portfolios/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ 
        success: false, 
        message: "Portfolio not found" 
      });
    }
    
    res.json({ 
      success: true, 
      portfolio 
    });
  } catch (err) {
    console.error("Error fetching portfolio:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching portfolio" 
    });
  }
});

// Test Gemini API endpoint
app.get("/test-gemini", async (req, res) => {
  try {
    console.log("Testing Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello! Please respond with 'Gemini API is working correctly!'");
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: "Gemini API is working!",
      response: text.trim(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Gemini API test failed:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: "Make sure your GEMINI_API_KEY is valid and Gemini API is enabled"
    });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    gemini_configured: !!process.env.GEMINI_API_KEY,
    mongodb_configured: !!process.env.MONGO_URI
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

// Handle 404 routes
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
  console.log(`Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});