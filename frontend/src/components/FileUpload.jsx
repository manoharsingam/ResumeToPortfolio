import React from "react";

export default function FileUpload({ file, setFile }) {
  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  return (
    <div>
      <label className="block font-semibold mb-2">Upload Resume</label>
      <input
        type="file"
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded hover:border-primary transition"
      />
      {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
    </div>
  );
}
