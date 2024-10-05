import React from "react";

const Uploadfield = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-white text-[21px] font-semibold">
        Upload members list*
      </p>

      <div className="border-2 relative border-[#333333] bg-[#fff]/[.04] h-[260px] border-dashed flex justify-center items-center">
        <p className="text-white text-center">Drag & drop or click to <br /> choose files</p>
        <input type="file" className="h-full w-full absolute opacity-0" />
      </div>

      <div className="flex flex-row justify-between py-[2px]">
        <p className="text-white text-[14px] flex justify-start">
          Supported Format: XLS, XLSX
        </p>
        <p className="text-white text-[14px] flex justify-end">Max: 100MB</p>
      </div>
    </div>
  );
};

export default Uploadfield;
