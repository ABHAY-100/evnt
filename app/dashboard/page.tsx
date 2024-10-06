"use client"
import React, { useState } from "react";
import Button from "@/components/Button";
import Inputfield from "@/components/Inputfield";
import Uploadfield from "@/components/Uploadfield";

const Page = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Add your form submission logic here
    console.log(`Group Name: ${groupName}, Description: ${groupDescription}, File: ${selectedFile?.name || 'None'}`);
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
          <Button text="Group" variant="light" />
          <Button text="Channel" variant="dark" onClick={() => alert('feat under work!')} />
        </div>

        <div className="gap-[60px] flex flex-col">
          <Inputfield 
            text="Group Name*" 
            placeholder="bro group name here..!" 
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)} 
          />
          <Inputfield 
            text="Group Description" 
            placeholder="try typing something here..!" 
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)} 
          />
          <Uploadfield onFileChange={handleFileChange} />
        </div>

        <div className="mb-[250px]">
          <Button text="Continue" variant="light" type="submit" /> {/* This button is the submit button */}
        </div>
      </form>
    </div>
  );
};

export default Page;
