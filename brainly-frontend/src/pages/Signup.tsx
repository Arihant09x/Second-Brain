import { useRef, useState } from "react";
import { z } from "zod";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import signupImage from "../assets/Signup.svg";
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
      usernameLength: validationChecks.usernameLength,
    });
  }

  async function signup() {
    try {
      setLoading(true);
      if (!name || !username || !password) {
        setErrorMessage("All fields are required!");
        setValue(false);
        setLoading(false);
        return;
      }

      await axios.post(BACKEND_URL + "api/v1/signup", {
        username,
        password,
      });

      setErrorMessage("Signed up successfully!");
      setValue(true);
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Sign-up failed. Please try again!"
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-200">
      <div className="w-full md:w-1/2 flex justify-center items-center p-5">
        <img src={signupImage} alt="Sign Up" className="max-w-full h-auto" />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-5">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <div className="text-center font-bold text-xl mb-4">
            <p>Welcome To Second Brain</p>
            <p>Please Sign Up</p>
          </div>

          <div className="space-y-1 -ml-3 md:ml-20">
            <Input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              refence={usernameRef}
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            <Input
              refence={passwordRef}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="flex justify-center items-center gap-2 mt-5">
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

          {errorMessage && (
            <LabelInput
              label={errorMessage}
              success={TrueOrFalse}
              startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
            />
          )}

          <h1 className="text-sm font-bold mt-5">Validation</h1>
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
