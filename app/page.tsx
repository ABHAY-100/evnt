"use client"; // Required for client-side components

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-black w-full h-screen text-white flex justify-center items-center">
      <button 
        onClick={handleClick}
        className="text-[30px] font-bold py-[36px] px-[44px] border-2 border-dashed border-white/[.4] hover:border-white ease-in-out transition"
      >
        Get Started
      </button>
    </div>
  );
}
