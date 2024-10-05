import React from "react";
import Button from "@/components/Button";

const page = () => {
  return (
    <div className="h-screen max-w-[545.62px] mx-auto">
      <div className="flex flex-col gap-[52px]">
        <div className="pt-[250px] flex flex-col gap-[9px] h-fit">
          <p className="flex flex-col justify-center text-white text-center items-center text-[34.2px] font-semibold">
            So, what’re you tryna create?
          </p>
          <p className="flex justify-center text-white text-center items-center text-[16.2px] font-semibold leading-[-2%]">
            Just pick what you need!
          </p>
        </div>

        <div className="max-w-[545px] mx-auto w-full flex flex-row gap-[32px]">
          <Button />
          <Button />
        </div>
      </div>
    </div>
  );
};

export default page;
