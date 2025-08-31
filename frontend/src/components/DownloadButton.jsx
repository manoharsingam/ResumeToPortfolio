import React from "react";

export default function DownloadButton({ code }) {
  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "portfolio.html";
    link.click();
  };

  return (
    <button
      onClick={downloadFile}
      className="mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:from-green-600 hover:to-teal-600 transition-all"
    >
      Download Portfolio
    </button>
  );
}
