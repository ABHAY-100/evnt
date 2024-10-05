"use client"
import React from "react";
import Button from "@/components/Button";
import Inputfield from "@/components/Inputfield";
import Uploadfield from "@/components/Uploadfield";

const page = () => {
  const handleClick = () => {
    alert('feat under work!'); // Replace with your desired action
  };

  return (
    <div className="h-screen max-w-[545.62px] mx-auto gap-[60px] flex flex-col py-[250px]">
      <div className="flex flex-col gap-[52px]">
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
          <Button text="Channel" variant="dark" onClick={handleClick} />
        </div>

        <div className="gap-[60px] flex flex-col">
          <Inputfield text="Group Name*" placeholder="bro group name here!.." />
          <Inputfield text="Group  Description" placeholder="try typing something here!.." />
          <Uploadfield />
        </div>

        <div className="mb-[250px]">
        <Button text="Continue" variant="light" />
        </div>
      </div>
    </div>
  );
};

export default page;
