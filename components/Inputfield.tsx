import React from 'react'

interface InputfieldProps {
  text: string;
  placeholder: string;
}

const Inputfield: React.FC<InputfieldProps> = ({ text, placeholder }) => {
  return (
    <div className='flex flex-col gap-[10px]'>
      <label className='text-white text-[21px] font-semibold'>{text}</label>
      <input
        className='bg-transparent placeholder-white/[.5] text-[18px] outline-none border-b-[1.69px] w-full pb-[6px] text-white/[.8] border-white/[.5] focus:border-white/[.8]'
        placeholder={placeholder}
      />
    </div>
  )
}

export default Inputfield;
