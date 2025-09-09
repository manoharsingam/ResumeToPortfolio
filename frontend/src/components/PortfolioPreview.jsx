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





// import React, { useEffect, useRef, useState } from "react";

// export default function PortfolioPreview({ previewCode }) {
//   const iframeRef = useRef(null);
//   const [height, setHeight] = useState(600);

//   // Convert React JSX to HTML for preview
//   const createPreviewHTML = (reactCode) => {
//     if (!reactCode || reactCode.length < 50) return '';

//     // Clean and prepare the React code
//     let cleanCode = reactCode
//       .replace(/import\s+React.*?from.*?['"']react['"'];?\s*/g, '')
//       .replace(/export\s+default\s+function\s+(\w+)\s*\(\s*\)\s*{/, 'function $1() {')
//       .trim();

//     // Ensure the code is wrapped properly
//     if (!cleanCode.includes('ReactDOM.createRoot')) {
//       // Find the function name
//       const functionMatch = cleanCode.match(/function\s+(\w+)\s*\(/);
//       const functionName = functionMatch ? functionMatch[1] : 'App';
      
//       // Add the render call at the end
//       cleanCode += `\n\nconst root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(React.createElement(${functionName}));`;
//     }

//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Portfolio Preview</title>
//     <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
//     <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
//     <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//         body {
//             margin: 0;
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//             -webkit-font-smoothing: antialiased;
//         }
//         * { box-sizing: border-box; }
        
//         /* Loading animation */
//         .loading-spinner {
//             width: 40px;
//             height: 40px;
//             border: 4px solid #f3f4f6;
//             border-top: 4px solid #3b82f6;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//             margin: 20px auto;
//         }
        
//         @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//         }
//     </style>
//     <script>
//         // Enhanced error handling
//         window.addEventListener('error', function(e) {
//             console.error('Runtime Error:', e.error);
//             const root = document.getElementById('root');
//             if (root) {
//                 root.innerHTML = \`
//                     <div style="padding: 40px; text-align: center; background: #fef2f2; margin: 20px; border-radius: 8px;">
//                         <h3 style="color: #dc2626; margin: 0 0 15px 0;">Portfolio Preview Error</h3>
//                         <p style="color: #991b1b; margin: 0 0 10px 0;">There was an issue rendering the generated code.</p>
//                         <p style="color: #6b7280; font-size: 14px; margin: 0;">The portfolio was generated but needs minor syntax adjustments.</p>
//                     </div>
//                 \`;
//             }
//         });
        
//         // Tailwind config
//         tailwind.config = {
//             darkMode: 'class',
//             theme: {
//                 extend: {
//                     animation: {
//                         'float': 'float 6s ease-in-out infinite',
//                         'pulse-slow': 'pulse 4s infinite',
//                         'bounce-slow': 'bounce 3s infinite',
//                     },
//                     keyframes: {
//                         float: {
//                             '0%, 100%': { transform: 'translateY(0px)' },
//                             '50%': { transform: 'translateY(-20px)' }
//                         }
//                     }
//                 }
//             }
//         };
//     </script>
// </head>
// <body>
//     <div id="root">
//         <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
//             <div style="text-align: center; color: white;">
//                 <div class="loading-spinner"></div>
//                 <p style="margin-top: 20px;">Loading Portfolio Preview...</p>
//             </div>
//         </div>
//     </div>
    
//     <script type="text/babel" data-presets="react">
//         try {
//             // Wrap the code execution in a try-catch
//             ${cleanCode}
//         } catch (error) {
//             console.error('Babel/React Error:', error);
            
//             // Create a safe fallback component
//             function ErrorFallback() {
//                 return React.createElement('div', {
//                     style: {
//                         padding: '40px',
//                         textAlign: 'center',
//                         background: '#fef2f2',
//                         margin: '20px',
//                         borderRadius: '8px',
//                         border: '1px solid #fecaca'
//                     }
//                 }, [
//                     React.createElement('h3', {
//                         key: 'title',
//                         style: { color: '#dc2626', margin: '0 0 15px 0' }
//                     }, 'Preview Compilation Error'),
//                     React.createElement('p', {
//                         key: 'message',
//                         style: { color: '#991b1b', margin: '0 0 10px 0' }
//                     }, 'The generated portfolio code has syntax issues.'),
//                     React.createElement('p', {
//                         key: 'suggestion',
//                         style: { color: '#6b7280', fontSize: '14px', margin: '0' }
//                     }, 'Try downloading the code and checking it manually, or generate a new one.')
//                 ]);
//             }
            
//             const root = ReactDOM.createRoot(document.getElementById('root'));
//             root.render(React.createElement(ErrorFallback));
//         }
//     </script>
// </body>
// </html>`;

//     return htmlContent;
//   };

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     if (previewCode && previewCode.length > 50) {
//       // Create HTML from React code
//       const htmlContent = createPreviewHTML(previewCode);
//       iframe.srcdoc = htmlContent;

//       // Update height after content loads
//       const timer = setTimeout(() => {
//         try {
//           const doc = iframe.contentDocument || iframe.contentWindow.document;
//           if (doc && doc.body) {
//             const contentHeight = Math.max(
//               doc.body.scrollHeight,
//               doc.body.offsetHeight,
//               doc.documentElement.clientHeight,
//               doc.documentElement.scrollHeight,
//               doc.documentElement.offsetHeight
//             );
//             if (contentHeight > 100) {
//               setHeight(Math.max(600, contentHeight + 100));
//             }
//           }
//         } catch (err) {
//           console.log('Cannot access iframe content for height calculation');
//         }
//       }, 2000);

//       return () => clearTimeout(timer);
//     } else {
//       // Clear iframe if no code
//       iframe.srcdoc = '';
//     }
//   }, [previewCode]);

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
//         {previewCode && (
//           <div className="flex gap-2">
//             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//               React + TailwindCSS
//             </span>
//             <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//               Responsive
//             </span>
//           </div>
//         )}
//       </div>
      
//       <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
//         {previewCode ? (
//           <div className="relative">
//             {/* Browser mockup header */}
//             <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
//               <div className="flex gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               </div>
//               <div className="flex-1 text-center text-sm text-gray-600">
//                 Portfolio Preview
//               </div>
//               <div className="text-xs text-gray-500">
//                 Generated Code Length: {previewCode.length} chars
//               </div>
//             </div>
            
//             {/* Iframe content */}
//             <iframe
//               ref={iframeRef}
//               title="portfolio-preview"
//               className="w-full"
//               style={{ height: `${height}px`, minHeight: '400px' }}
//               frameBorder="0"
//               sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
//             />
//           </div>
//         ) : (
//           <div className="h-96 flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <div className="text-6xl mb-4">🚀</div>
//               <p className="text-gray-500 text-lg mb-2">No preview available</p>
//               <p className="text-gray-400 text-sm">Upload a resume and click Generate to see your portfolio</p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Debug info */}
//       {previewCode && (
//         <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
//           <strong>Debug:</strong> Code preview loaded - {previewCode.split('\n').length} lines, {previewCode.length} characters
//         </div>
//       )}
//     </div>
//   );
// }