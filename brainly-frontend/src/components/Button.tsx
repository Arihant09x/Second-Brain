import { ClipLoader } from "react-spinners";
import { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullwidth?: boolean;
  loading?: boolean;
}

const variantStyle = {
  primary: "bg-[#5046e4] text-white hover:bg-[#4036c4]",
  secondary: "bg-[#e0e7ff] text-[#6059bd] hover:bg-[#c7d2fe]",
};

const Defaultsize = {
  sm: "text-sm px-3 py-2 md:px-4 md:py-2",
  md: "text-base px-4 py-2 md:px-6 md:py-3",
  lg: "text-lg px-5 py-3 md:px-8 md:py-4",
};

const Button = ({
  variant,
  size = "md",
  text,
  startIcon,
  endIcon,
  onClick,
  fullwidth = false,
  loading,
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 
        ${variantStyle[variant]} 
        ${Defaultsize[size]} 
        ${fullwidth ? "w-full" : "w-auto"} 
        rounded-md font-medium transition-all duration-200 
        ease-out hover:scale-105 hover:shadow-md 
        disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <ClipLoader size={20} speedMultiplier={1} color="white" />
      ) : (
        <>
          {startIcon && <div className="flex-shrink-0">{startIcon}</div>}
          <span className="whitespace-nowrap">{text}</span>
          {endIcon && <div className="flex-shrink-0">{endIcon}</div>}
        </>
      )}
    </button>
  );
};

export default Button;
