import React from "react";

interface ButtonProps {
  text: string;
  variant?: "light" | "dark";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "light",
  onClick,
}) => {
  const isDarkVariant = variant === "dark";

  return (
    <button
      className={`font-semibold text-[17px] w-full min-h-[53px] 
        ${
          isDarkVariant ? "bg-white/[0.08] text-white" : "bg-white text-black"
        }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
