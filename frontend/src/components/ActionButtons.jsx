import React from "react";

export default function ActionButtons({ onGenerate, onDownload, onHost, isGenerating, hasCode }) {
  return (
    <div className="flex flex-col gap-2 mt-auto">
      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`w-full p-2 rounded transition text-white ${
          isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-secondary hover:bg-indigo-700"
        }`}
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>

      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={!hasCode || isGenerating}
        className={`w-full p-2 rounded transition text-white ${
          !hasCode || isGenerating ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-indigo-800"
        }`}
      >
        Download
      </button>

      {/* Host Button */}
      <button
        onClick={onHost}
        disabled={!hasCode || isGenerating}
        className={`w-full p-2 rounded transition text-white ${
          !hasCode || isGenerating ? "bg-gray-400 cursor-not-allowed" : "bg-accent hover:bg-pink-600"
        }`}
      >
        Host
      </button>
    </div>
  );
}
