import React from "react";

export default function OptionsSelector({ label, options, value, setValue }) {
  return (
    <div>
      <label className="block font-semibold mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded hover:border-primary transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
