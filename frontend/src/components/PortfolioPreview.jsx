import React, { useEffect, useRef, useState } from "react";

export default function PortfolioPreview({ previewCode }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(600); // default iframe height

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Update iframe height based on content
    const timer = setInterval(() => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc.body.scrollHeight !== height) {
          setHeight(doc.body.scrollHeight + 50); // add some padding
        }
      } catch (err) {
        // cross-origin issues can occur if src changes outside
      }
    }, 500);

    return () => clearInterval(timer);
  }, [previewCode, height]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
      <div className="border border-gray-300 rounded shadow p-2 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          title="portfolio-preview"
          className="w-full"
          style={{ height: `${height}px` }}
          srcDoc={previewCode}
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
