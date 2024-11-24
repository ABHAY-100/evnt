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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="max-w-[600px] mx-auto bg-[#1A1A1A] p-8 rounded-xl">
        <div className="flex flex-col gap-6 items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-white">
            Create a New {isChannel ? "Channel" : "Group"}
          </h1>
          <div className="flex gap-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleStateChange("isChannel", false)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                !isChannel ? "bg-white text-black" : "bg-white/10 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Group
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleStateChange("isChannel", true)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isChannel ? "bg-white text-black" : "bg-white/10 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Channel
            </button>
          </div>
          <p className="text-white/60">
            Fill in the details and upload your members list
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white text-lg font-medium">
              {isChannel ? "Channel Name" : "Group Name"}*
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={groupName}
              onChange={(e) => handleStateChange("groupName", e.target.value)}
              placeholder={`Enter ${isChannel ? "channel" : "group"} name`}
              className={`w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-lg font-medium">
              {isChannel ? "Channel Description" : "Group Description"}
            </label>
            <textarea
              value={groupDescription}
              disabled={isLoading}
              onChange={(e) =>
                handleStateChange("groupDescription", e.target.value)
              }
              placeholder={`Enter ${
                isChannel ? "channel" : "group"
              } description`}
              className={`w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none min-h-[100px] resize-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-lg font-medium">
              Upload Members List*
            </label>
            <div className={`border-2 border-dashed border-white/20 rounded-lg p-8 text-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
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
                className={`cursor-pointer text-white/60 hover:text-white ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
              >
                {selectedFile ? selectedFile.name : "Click to upload CSV file"}
              </label>
            </div>
            <p className="text-white/40 text-sm">
              Supported format: CSV (max 10MB)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating..." : `Create ${isChannel ? "Channel" : "Group"}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
