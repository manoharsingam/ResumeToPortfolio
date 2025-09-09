// import React, { useState } from "react";
// import axios from "axios";
// import FileUpload from "./components/FileUpload";
// import OptionsSelector from "./components/OptionsSelector";
// import CodeEditor from "./components/CodeEditor";
// import PortfolioPreview from "./components/PortfolioPreview";
// import ActionButtons from "./components/ActionButtons";
// import "./index.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [template, setTemplate] = useState("template1");
//   const [level, setLevel] = useState("basic");
//   const [previewCode, setPreviewCode] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const handleGenerate = async () => {
//     if (!file) return alert("Please upload a resume first!");
//     setIsGenerating(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       // optionally, you can send template and level to backend
//       formData.append("template", template);
//       formData.append("level", level);

//       const response = await axios.post(
//         "http://localhost:5000/generate-portfolio",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // Backend returns generated code
//       setPreviewCode(response.data.code);
//     } catch (error) {
//       console.error(error);
//       alert("Error generating portfolio. Check backend or API key.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!previewCode) return;
//     const blob = new Blob([previewCode], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "portfolio.html";
//     link.click();
//   };

//   const handleHost = () => {
//     if (!previewCode) return;
//     alert("Hosting feature coming soon! (deploy to Vercel/Netlify)");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-primary text-white p-4 shadow-md flex justify-center items-center">
//         <h1 className="text-xl font-bold text-center">Resume → Portfolio Builder</h1>
//       </nav>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside className="w-72 bg-white shadow-md p-6 flex flex-col gap-6">
//           <FileUpload file={file} setFile={setFile} />
//           <OptionsSelector
//             label="Choose Template"
//             options={[
//               { value: "template1", label: "Template 1" },
//               { value: "template2", label: "Template 2" },
//               { value: "template3", label: "Template 3" },
//             ]}
//             value={template}
//             setValue={setTemplate}
//           />
//           <OptionsSelector
//             label="Level"
//             options={[
//               { value: "basic", label: "Basic" },
//               { value: "intermediate", label: "Intermediate" },
//               { value: "advanced", label: "Advanced" },
//             ]}
//             value={level}
//             setValue={setLevel}
//           />

//           <ActionButtons
//             onGenerate={handleGenerate}
//             onDownload={handleDownload}
//             onHost={handleHost}
//             isGenerating={isGenerating}
//           />
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
//           <PortfolioPreview
//             previewCode={previewCode}
//             title={`portfolio-preview-${template}-${level}`} // unique iframe title
//           />
//           <CodeEditor code={previewCode} setCode={setPreviewCode} />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;




import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import OptionsSelector from "./components/OptionsSelector";
import CodeEditor from "./components/CodeEditor";
import PortfolioPreview from "./components/PortfolioPreview";
import ActionButtons from "./components/ActionButtons";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [template, setTemplate] = useState("template1");
  const [level, setLevel] = useState("basic");
  const [previewCode, setPreviewCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    if (!file) {
      setError("Please upload a resume first!");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("template", template);
      formData.append("level", level);

      console.log("Sending request to backend...");

      const response = await axios.post(
        "http://localhost:5000/generate-portfolio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      // Fix: Handle both response structures
      if (response.data.success && response.data.code) {
        setPreviewCode(response.data.code);
        setSuccess("Portfolio generated successfully!");
      } else if (response.data.code) {
        // Fallback for direct code response
        setPreviewCode(response.data.code);
        setSuccess("Portfolio generated successfully!");
      } else {
        setError(response.data.message || "Failed to generate portfolio");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        setError(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        setError("Network error. Make sure the backend server is running on port 5000");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!previewCode) {
      setError("No code to download. Please generate a portfolio first.");
      return;
    }

    try {
      // Fix: Determine file type and extension based on content
      const isHtml = previewCode.includes('<!DOCTYPE html') || previewCode.includes('<html');
      const isReact = previewCode.includes('import React') || previewCode.includes('export default');
      
      let fileExtension = '.html';
      let mimeType = 'text/html';
      let fileName = `Portfolio-${template}-${level}`;

      if (isReact) {
        fileExtension = '.jsx';
        mimeType = 'text/javascript';
        fileName += '-App';
      }

      const blob = new Blob([previewCode], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName + fileExtension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`Portfolio ${fileExtension} downloaded successfully!`);
    } catch (error) {
      setError("Error downloading file");
    }
  };

  const handleHost = () => {
    if (!previewCode) {
      setError("No code to host. Please generate a portfolio first.");
      return;
    }
    setSuccess("To host your portfolio: 1) Download the files 2) Upload to Vercel, Netlify, or GitHub Pages");
  };

  // Fix: Proper fallback template implementation
  const useFallbackTemplate = () => {
    const fallbackCode = `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Sample Portfolio</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                <a href="#skills" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Skills</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
            JS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              John Smith
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Full Stack Developer & Software Engineer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Download Resume
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              View Projects
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12"></div>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            This is a sample portfolio template generated by the Resume to Portfolio Builder.
            Upload your resume to create a personalized version with your actual information.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg hover:shadow-md">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">john@example.com</p>
            </div>
            <div className="p-6 bg-white rounded-lg hover:shadow-md">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="p-6 bg-white rounded-lg hover:shadow-md">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600">New York, NY</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}`;

    setPreviewCode(fallbackCode);
    setError("");
    setSuccess("Showing sample portfolio template!");
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center">
            🚀 Resume → Portfolio Builder
          </h1>
        </div>
      </nav>

      {/* Error/Success Messages */}
      {(error || success) && (
        <div className="container mx-auto p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                ×
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{success}</span>
              <button onClick={clearMessages} className="text-green-700 hover:text-green-900">
                ×
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-lg p-6 flex flex-col gap-6">
          <div className="space-y-6">
            <FileUpload file={file} setFile={setFile} />

            <OptionsSelector
              label="Choose Template"
              options={[
                { value: "template1", label: "Modern Professional" },
                { value: "template2", label: "Creative Portfolio" },
                { value: "template3", label: "Minimalist Design" },
              ]}
              value={template}
              setValue={setTemplate}
            />

            <OptionsSelector
              label="Complexity Level"
              options={[
                { value: "basic", label: "Basic Layout" },
                { value: "intermediate", label: "Enhanced Features" },
                { value: "advanced", label: "Full Featured" },
              ]}
              value={level}
              setValue={setLevel}
            />
          </div>

          <ActionButtons
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            onHost={handleHost}
            isGenerating={isGenerating}
            hasCode={!!previewCode}
          />

          {/* Template Preview Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={useFallbackTemplate}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm"
            >
              🎨 Preview Sample Template
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              See what the generated portfolio looks like
            </p>
          </div>

          {/* Progress Indicator */}
          {isGenerating && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Generating your portfolio...</p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
          <PortfolioPreview previewCode={previewCode} />
          <CodeEditor code={previewCode} setCode={setPreviewCode} />
        </main>
      </div>
    </div>
  );
}

export default App;
