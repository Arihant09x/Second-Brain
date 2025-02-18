import { useRef, useState } from "react";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import secure from "../assets/signup.svg";

export function Signup() {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TrueOrFalse, setValue] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    try {
      setLoading(true);
      const name = usernameRef.current?.value;
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!name || !username || !password) {
        setErrorMessage("Username and Password are required!");
        setValue(false);
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/api/v1/signup", {
        username,
        password,
      });

      setErrorMessage("You have signed up successfully! ");
      setValue(true);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Signup failed. Please try again! ");
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
        <div className="bg-white rounded border w-90 h-90 p-6">
          <div className="text-center font-bold text-xl">
            <p>Welcome To Second Brain</p>
            <p>Please Sign Up</p>
          </div>
          <div className="mx-auto mt-7 max-w-60">
            <Input placeholder="Name" type={"text"} />
            <Input refence={usernameRef} type={"text"} placeholder="Username" />
            <Input
              refence={passwordRef}
              type={"password"}
              placeholder="Password"
            />
          </div>
          <div className="flex justify-center items-center gap-2 mt-7">
            <a className="underline hover:cursor-pointer" href="/signin">
              Already have an account
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
        </div>
      </div>
    </div>
  );
}
