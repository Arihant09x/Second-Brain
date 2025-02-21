import { useRef, useState } from "react";
import { z } from "zod";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import signinImage from "../assets/Signin.svg";

import { BACKEND_URL } from "../config";

export function Signin() {
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationChecks, setValidationChecks] = useState({
    usernameLength: false,
    passwordLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const usernameSchema = z.string().min(3).max(10);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TrueOrFalse, setValue] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
    setValidationChecks((prev) => ({
      ...prev,
      usernameLength: usernameSchema.safeParse(e.target.value).success,
    }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
  }

  async function signin() {
    try {
      setLoading(true);
      if (!username || !password) {
        setErrorMessage(" All fields are required!");
        setValue(false);
        setLoading(false);
        return;
      }

      await axios.post(BACKEND_URL + "api/v1/signin", {
        username,
        password,
      });

      setErrorMessage(" Signed in successfully!");
      setValue(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Sign-in failed. Please try again!"
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again!");
      }
      setValue(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex flex-col md:flex-row">
      <div
        className="w-full md:w-1/2 h-1/3 md:h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${signinImage})`,
          backgroundSize: "70%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white rounded border w-11/12 md:w-90 h-auto md:h-130 p-6">
          <div className="text-center font-bold text-xl">
            <p>Welcome To Second Brain</p>
            <p>Please Sign In</p>
          </div>

          <div className="mx-auto mt-7 max-w-60">
            <Input
              refence={usernameRef}
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              isValid={validationChecks.usernameLength}
              className={
                username.length === 0
                  ? "border-gray-400"
                  : validationChecks.usernameLength
                    ? "border-green-500"
                    : "border-red-500"
              }
            />

            <Input
              refence={passwordRef}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              isValid={
                validationChecks.passwordLength &&
                validationChecks.uppercase &&
                validationChecks.lowercase &&
                validationChecks.number &&
                validationChecks.specialChar
              }
              className={
                password.length === 0
                  ? "border-gray-400"
                  : validationChecks.passwordLength &&
                      validationChecks.uppercase &&
                      validationChecks.lowercase &&
                      validationChecks.number &&
                      validationChecks.specialChar
                    ? "border-green-500"
                    : "border-red-500"
              }
            />
          </div>

          <div className="flex justify-center items-center gap-2 mt-7">
            <a className="underline hover:cursor-pointer" href="/signup">
              Don't have an account?
            </a>
            <Button
              variant="primary"
              size="md"
              onClick={signin}
              text="Sign In"
              loading={isLoading}
            />
          </div>

          {errorMessage && (
            <LabelInput
              label={errorMessage}
              success={TrueOrFalse}
              startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
