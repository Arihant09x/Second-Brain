import React, { useState, useEffect, ReactElement } from "react";

interface LabelInputProps {
  label: string;
  success: boolean;
  startIcon: ReactElement;
}

const LabelInput: React.FC<LabelInputProps> = ({
  label,
  success,
  startIcon,
}) => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (startIcon) {
      setShowIcon(true);
      const timer = setTimeout(() => {
        setShowIcon(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [startIcon]);

  return (
    <div className="fixed top-6 right-4 z-50">
      <div
        className={`flex items-center p-4 rounded shadow-lg transition-all duration-1000 transform ${
          success ? "bg-green-500 text-white" : "bg-red-500 text-white"
        } ${showIcon ? "animate-slide-in" : "animate-slide-out"}`}
      >
        <div className="mr-2">{startIcon}</div>
        <div>{label}</div>
      </div>
    </div>
  );
};

export default LabelInput;
