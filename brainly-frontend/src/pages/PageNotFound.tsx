import React from "react";
import { useNavigate } from "react-router-dom";
import { BrainICon } from "../components/Icons/BrainIcon";
import Button from "../components/Button";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <div
        className="flex absolute top-2 left-4 items-center gap-2 mt-1 hover:cursor-pointer"
        onClick={() => {
          navigate("/Dashboard");
        }}
      >
        <BrainICon />
        <h1 className="text-3xl font-bold">Second Brain</h1>
      </div>
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="text-lg mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex justify-center items-center mt-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/")}
            text="Return to Home"
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
