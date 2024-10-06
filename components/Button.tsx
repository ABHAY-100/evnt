import React from "react";

interface ButtonProps {
  text: string;
  variant?: "light" | "dark";
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; // Add type prop
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "light",
  onClick,
  type = "button", // Default to button
}) => {
  const isDarkVariant = variant === "dark";

  return (
    <button
      type={type} // Set button type here
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
