import React, { useState } from "react";

const UploadField = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check if the selected file has a CSV extension
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError(null); // Clear any previous errors
      } else {
        setSelectedFile(null);
        setError("Please upload a file in CSV format.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-white text-[21px] font-semibold">
        Upload members list*
      </p>

      <div className="border-2 relative border-[#333333] bg-[#fff]/[.04] h-[260px] border-dashed flex justify-center items-center">
        <p className="text-white text-center">
          {selectedFile ? `Selected file: ${selectedFile.name}` : "Drag & drop or click to choose files"}
        </p>
        <input
          type="file"
          accept=".csv"
          className="h-full w-full absolute opacity-0"
          onChange={handleFileChange}
        />
      </div>

      {/* Display error message if the file format is incorrect */}
      {error && (
        <p className="text-red-500 text-[16px] text-center mt-2">
          {error}
        </p>
      )}

      <div className="flex flex-row justify-between py-[2px]">
        <p className="text-white text-[14px] flex justify-start">
          Supported Format: CSV
        </p>
        <p className="text-white text-[14px] flex justify-end">Max: 15MB</p>
      </div>
    </div>
  );
};

export default UploadField;
