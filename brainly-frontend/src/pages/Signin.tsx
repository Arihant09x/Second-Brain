import { useRef, useState } from "react";
import { z } from "zod";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import login from "../assets/Secure-login.svg";
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
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  async function signin() {
    try {
      setLoading(true);
      if (!username || !password) {
        setErrorMessage("⚠️ Username and Password are required");
        setValue(false);
        setLoading(false);
        return;
      }
      const response = await axios.post(BACKEND_URL + "api/v1/signin", {
        username,
        password,
      });
      const jwt = response.data.token;
      if (jwt) {
        localStorage.setItem("token", jwt);
        setErrorMessage(" Sign-In Successful!");
        setValue(true);
        setTimeout(() => navigate("/Dashboard"), 2000);
      } else {
        setErrorMessage(" Sign-in failed. Please try again!");
        setValue(false);
      }
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Sign-in failed."
          : "An error occurred."
      );
      setValue(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-200 p-4 md:p-0">
      <div
        className="w-full md:w-1/2 h-64 md:h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${login})`,
          backgroundSize: "70%",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="text-center font-bold text-xl">
            <p>Welcome To Second Brain</p>
            <p>Please Sign In</p>
          </div>

          <div className="mt-5 md:ml-20">
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
              isValid={Object.values(validationChecks).every(Boolean)}
              className={
                password.length === 0
                  ? "border-gray-400"
                  : Object.values(validationChecks).every(Boolean)
                    ? "border-green-500"
                    : "border-red-500"
              }
            />
          </div>

          <div className="mt-5 flex justify-center md:ml">
            <Button
              variant="primary"
              size="md"
              onClick={signin}
              text="Sign In"
              fullwidth={true}
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

          <a
            className="block text-center mt-3 text-blue-500 hover:underline"
            href="/signup"
          >
            Create an account?
          </a>

          <ul className="mt-3 text-sm">
            <h1 className="font-bold">Validation</h1>
            {[
              {
                check: validationChecks.usernameLength,
                text: "Username (3-10 characters)",
              },
              {
                check: validationChecks.passwordLength,
                text: "Password (8-20 characters)",
              },
              {
                check: validationChecks.uppercase,
                text: "At least one uppercase letter",
              },
              {
                check: validationChecks.lowercase,
                text: "At least one lowercase letter",
              },
              { check: validationChecks.number, text: "At least one number" },
              {
                check: validationChecks.specialChar,
                text: "At least one special character (@$!%*?&#)",
              },
            ].map((item, index) => (
              <li
                key={index}
                className={item.check ? "text-green-600" : "text-gray-500"}
              >
                {item.check ? "✅" : "⚪"} {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
