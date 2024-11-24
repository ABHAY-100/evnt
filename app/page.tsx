"use client";

import React from "react";
import { useForm } from "@/hooks/use-form";

const Page = () => {
  const { formState, isLoading, handleStateChange, handleSubmit } = useForm();
  const { isChannel, groupName, groupDescription, selectedFile, resetFileKey } =
    formState;

  const handleFileChange = (file: File | null) => {
    handleStateChange("selectedFile", file);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while processing the form"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] py-8">
      <div className="max-w-[600px] mx-auto bg-[#000000] p-8 my-[160px]">
        {/* top content + controls */}
        <div className="flex flex-col gap-[52px] items-center mb-8">
          <div className="flex justify-center flex-col items-center gap-[9px]">
            <h1 className="text-3xl font-semibold text-center text-white leading-[-2%]">
              {/* Create a New {isChannel ? "Channel" : "Group"} */}
              So, what’re you tryna create?
            </h1>
            <p className="text-white text-base font-normal leading-[-2%]">
              Just pick what you need!
            </p>
          </div>
          <div className="flex gap-[32px] max-w-[540px] w-full justify-between h-[52px]">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleStateChange("isChannel", false)}
              className={`px-6 py-2 font-semibold ${
                !isChannel ? "bg-white text-black" : "bg-white/10 text-white"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } w-full text-base`}
            >
              Group
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleStateChange("isChannel", true)}
              className={`px-6 py-2 text-base font-semibold ${
                isChannel ? "bg-white text-black" : "bg-white/10 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""} w-full`}
            >
              Channel
            </button>
          </div>
        </div>

        {/* main form part */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-[60px] mt-[62px]"
        >
          <div className="flex flex-col gap-[10px]">
            <label className="text-white text-xl leading-[-2%] font-semibold">
              {isChannel ? "Channel Name" : "Group Name"}*
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={groupName}
              onChange={(e) => handleStateChange("groupName", e.target.value)}
              placeholder={`eg. JuicyChemistry`}
              className={`w-full py-2 bg-transparent placeholder-white/40 text-white border-b-2 border-white/40 font-normal focus:border-white/80 outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-white text-xl leading-[-2%] font-semibold">
              {isChannel ? "Channel Description" : "Group Description"}
            </label>
            <textarea
              value={groupDescription}
              disabled={isLoading}
              onChange={(e) =>
                handleStateChange("groupDescription", e.target.value)
              }
              placeholder={`try typing something here!..`}
              className={`w-full placeholder-white/40 py-2 bg-transparent h-11 text-white border-b-2 border-white/40 font-normal focus:border-white/80 outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-white text-xl leading-[-2%] font-semibold">
              Upload Members List*
            </label>
            <div
              className={`border-2 flex bg-[#FFF]/[0.04] justify-center items-center border-dashed border-white/20 text-center h-[240px] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                key={resetFileKey}
                type="file"
                accept=".csv"
                disabled={isLoading}
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer flex justify-center items-center text-white/40 hover:text-white/80 h-full w-full font-semibold text-sm ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
              >
                {selectedFile ? selectedFile.name : "Click to upload CSV file"}
              </label>
            </div>
            <div className="flex flex-row justify-between">
              <p className="text-white/80 text-sm font-medium">Supported Format: CSV</p>
              <p className="text-white/80 text-sm font-medium">Max: ∞</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-white text-black font-semibold hover:bg-white/90 transition-colors {
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "Creating..."
              : `Create ${isChannel ? "Channel" : "Group"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
