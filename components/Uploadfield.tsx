import React, { useState, useEffect } from "react";

interface UploadFieldProps {
  onFileChange: (file: File | null) => void;
  resetFile: boolean;
}

const UploadField: React.FC<UploadFieldProps> = ({
  onFileChange,
  resetFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resetFile) {
      setSelectedFile(null);
      onFileChange(null);
    }
  }, [resetFile, onFileChange]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError(null);
        onFileChange(file);
      } else {
        setSelectedFile(null);
        setError("Please upload a file in CSV format.");
        onFileChange(null);
      }
    } else {
      setSelectedFile(null);
      onFileChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-white text-[21px] font-semibold">
        Upload members list*
      </p>

      <div className="border-2 relative border-[#333333] bg-[#fff]/[.04] h-[260px] border-dashed flex justify-center items-center">
        <p className="text-white text-center">
          {selectedFile
            ? `Selected file: ${selectedFile.name}`
            : "Drag & drop or click to choose files"}
        </p>
        <input
          type="file"
          accept=".csv"
          className="h-full w-full absolute opacity-0"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-[16px] text-center mt-2">{error}</p>
      )}

      <div className="flex flex-row justify-between py-[2px]">
        <p className="text-white text-[14px] flex font-medium justify-start">
          Supported Format: CSV
        </p>
        <p className="text-white text-[14px] flex justify-end font-medium">
          Max: 10MB
        </p>
      </div>
    </div>
  );
};

export default UploadField;
