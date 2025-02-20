import { useRef, useState } from "react";
import { z } from "zod";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import secure from "../assets/signup.svg";
import { BACKEND_URL } from "../config";

export function Signup() {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
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
    setValidationChecks({
      passwordLength: value.length >= 8 && value.length <= 20,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&#]/.test(value),
      usernameLength: validationChecks.usernameLength, // Keep username validation
    });
  }

  async function signup() {
    try {
      setLoading(true);
      if (!name || !username || !password) {
        setErrorMessage(" All fields are required!");
        setValue(false);
        setLoading(false);
        return;
      }

      await axios.post(BACKEND_URL + "api/v1/signup", {
        username,
        password,
      });

      setErrorMessage(" Signed up successfully!");
      setValue(true);
      setTimeout(() => navigate("/signin"), 2000);
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
    <div className="h-screen w-screen bg-gray-200 flex">
      <div
        className="w-1/2 h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${secure})`,
          backgroundSize: "70%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="w-1/2 flex justify-center items-center">
        <div className="bg-white rounded border w-90 h-130 p-6">
          <div className="text-center font-bold text-xl">
            <p>Welcome To Second Brain</p>
            <p>Please Sign Up</p>
          </div>

          <div className="mx-auto mt-7 max-w-60">
            {/* Name Input */}
            <Input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Username Input */}
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

            {/* Password Input */}
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

          {/* Signup Button */}
          <div className="flex justify-center items-center gap-2 mt-7">
            <a className="underline hover:cursor-pointer" href="/signin">
              Already have an account?
            </a>
            <Button
              variant="primary"
              size="md"
              onClick={signup}
              text="Sign Up"
              loading={isLoading}
            />
          </div>

          {/* Error or Success Message */}
          {errorMessage && (
            <LabelInput
              label={errorMessage}
              success={TrueOrFalse}
              startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
            />
          )}

          {/* Bullet-point Validation */}
          <h1 className="text-sm font-bold">Validation</h1>
          <ul className="mt-3 text-sm">
            <li
              className={
                validationChecks.usernameLength
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {validationChecks.usernameLength ? "✅" : "⚪"} Username (3-10
              characters)
            </li>
            <li
              className={
                validationChecks.passwordLength
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {validationChecks.passwordLength ? "✅" : "⚪"} Password (8-20
              characters)
            </li>
            <li
              className={
                validationChecks.uppercase ? "text-green-600" : "text-gray-500"
              }
            >
              {validationChecks.uppercase ? "✅" : "⚪"} At least one uppercase
              letter
            </li>
            <li
              className={
                validationChecks.lowercase ? "text-green-600" : "text-gray-500"
              }
            >
              {validationChecks.lowercase ? "✅" : "⚪"} At least one lowercase
              letter
            </li>
            <li
              className={
                validationChecks.number ? "text-green-600" : "text-gray-500"
              }
            >
              {validationChecks.number ? "✅" : "⚪"} At least one number
            </li>
            <li
              className={
                validationChecks.specialChar
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {validationChecks.specialChar ? "✅" : "⚪"} At least one special
              character (@$!%*?&#)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
