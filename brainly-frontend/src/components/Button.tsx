import React, { ReactElement } from "react";
import { ClipLoader } from "react-spinners";

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
  primary: "bg-[#5046e4] text-white",
  secondary: "bg-[#e0e7ff] text-[#6059bd]",
};

const Defaultstyle = "rounded-md px-4 py-2 flex font-normal sm";
const Defaultsize = {
  sm: "py-1 px-2",
  md: "py-2 px-4",
  lg: "py-5 px-6",
};

const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${variantStyle[props.variant]} ${Defaultstyle} ${
        Defaultsize[props.size || "md"]
      } ${props.fullwidth ? " w-64 flex justify-center items-center" : ""}  
      ${props.loading ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm"}
      `}
      onClick={props.onClick}
      disabled={props.loading} // This prevents clicking when loading
    >
      <div className="flex items-center">
        {props.loading ? (
          <ClipLoader size={20} speedMultiplier={1} />
        ) : (
          <>
            {props.startIcon && (
              <div className="pr-2 py-1">{props.startIcon}</div>
            )}
            {props.text}
            {props.endIcon && <div className="pl-2 py-1">{props.endIcon}</div>}
          </>
        )}
      </div>
    </button>
  );
};

export default Button;
