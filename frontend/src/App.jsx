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

  const handleGenerate = async () => {
    if (!file) return alert("Please upload a resume first!");
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // optionally, you can send template and level to backend
      formData.append("template", template);
      formData.append("level", level);

      const response = await axios.post(
        "http://localhost:5000/generate-portfolio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Backend returns generated code
      setPreviewCode(response.data.code);
    } catch (error) {
      console.error(error);
      alert("Error generating portfolio. Check backend or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!previewCode) return;
    const blob = new Blob([previewCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio.html";
    link.click();
  };

  const handleHost = () => {
    if (!previewCode) return;
    alert("Hosting feature coming soon! (deploy to Vercel/Netlify)");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-primary text-white p-4 shadow-md flex justify-center items-center">
        <h1 className="text-xl font-bold text-center">Resume → Portfolio Builder</h1>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-md p-6 flex flex-col gap-6">
          <FileUpload file={file} setFile={setFile} />
          <OptionsSelector
            label="Choose Template"
            options={[
              { value: "template1", label: "Template 1" },
              { value: "template2", label: "Template 2" },
              { value: "template3", label: "Template 3" },
            ]}
            value={template}
            setValue={setTemplate}
          />
          <OptionsSelector
            label="Level"
            options={[
              { value: "basic", label: "Basic" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
            value={level}
            setValue={setLevel}
          />

          <ActionButtons
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            onHost={handleHost}
            isGenerating={isGenerating}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
          <PortfolioPreview
            previewCode={previewCode}
            title={`portfolio-preview-${template}-${level}`} // unique iframe title
          />
          <CodeEditor code={previewCode} setCode={setPreviewCode} />
        </main>
      </div>
    </div>
  );
}

export default App;
