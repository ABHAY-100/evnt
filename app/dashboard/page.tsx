"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Inputfield from "@/components/Inputfield";
import UploadField from "@/components/Uploadfield";

const csvToJson = async (file: File): Promise<any[]> => {
  const text = await file.text();
  const rows = text.split("\n").map((row) => row.split(","));
  const headers = rows[0];
  const data = rows.slice(1).map((row) =>
    row.reduce((obj, value, index) => {
      obj[headers[index]] = value;
      return obj;
    }, {} as any)
  );
  return data;
};

const Page = () => {
  const [isChannel, setIsChannel] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetFile, setResetFile] = useState(false);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please upload a CSV file");
      return;
    }

    try {
      const csvData = await csvToJson(selectedFile);

      const finalJson = {
        type: isChannel ? "Channel" : "Group",
        name: groupName,
        description: groupDescription,
        data: csvData,
      };

      const blob = new Blob([JSON.stringify(finalJson, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${groupName || "output"}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setGroupName("");
      setGroupDescription("");
      setSelectedFile(null);

      setResetFile(true);

      setTimeout(() => {
        setResetFile(false);
      }, 0);

      window.location.reload();
    } catch (error) {
      console.error("Error processing CSV:", error);
      alert("There was an error processing the CSV file.");
    }
  };

  return (
    <div className="h-screen max-w-[545.62px] mx-auto gap-[60px] flex flex-col py-[250px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[52px]">
        <div className="flex flex-col gap-[9px] h-fit">
          <p className="flex flex-col justify-center text-white text-center items-center text-[34.2px] font-semibold">
            So, what’re you tryna create?
          </p>
          <p className="flex justify-center text-white text-center items-center text-[16.2px] font-semibold leading-[-2%]">
            Just pick what you need!
          </p>
        </div>

        <div className="max-w-[545px] mx-auto w-full flex flex-row gap-[32px]">
          <Button
            text="Group"
            variant={!isChannel ? "light" : "dark"}
            onClick={() => setIsChannel(false)}
          />
          <Button
            text="Channel"
            variant={isChannel ? "light" : "dark"}
            onClick={() => setIsChannel(true)}
          />
        </div>

        <div className="gap-[60px] flex flex-col">
          <Inputfield
            isRequired={true}
            text={isChannel ? "Channel Name*" : "Group Name*"}
            placeholder={`e.g. JuicyChemistry`}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Inputfield
            text={isChannel ? "Channel Description" : "Group Description"}
            placeholder={`e.g. A skincare community focused on organic products`}
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
          <UploadField onFileChange={handleFileChange} resetFile={resetFile} />
        </div>

        <div className="mb-[250px]">
          <Button text="Continue" variant="light" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Page;
