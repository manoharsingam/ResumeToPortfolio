import React from "react";

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold text-gray-800">Editable Code</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-4 border border-gray-300 rounded shadow font-mono text-sm resize-none"
      />
    </div>
  );
}
