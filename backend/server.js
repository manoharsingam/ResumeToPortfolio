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