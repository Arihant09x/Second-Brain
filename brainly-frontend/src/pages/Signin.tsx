import { useRef, useState } from "react";
import Button from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import login from "../assets/Secure-login.svg";

export function Signin() {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TrueOrFalse, setValue] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    try {
      setLoading(true);
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!username || !password) {
        setErrorMessage("Username and Password are required");
        setValue(false);
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/v1/signin", {
        username,
        password,
      });

      const jwt = response.data.token;
      if (jwt) {
        localStorage.setItem("token", jwt);
        console.log("Token stored in local storage:", jwt);
        setErrorMessage("SignIn Successfully");
        setValue(true);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 2000);
      } else {
        console.error("Token not received from backend");
        setErrorMessage("Signin failed. Please try again!");
        setValue(false);
      }
    } catch (error) {
      console.error("Signin failed:", error);
      setErrorMessage("Signin failed. Please try again!");
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
          backgroundImage: `url(${login})`,
          backgroundSize: "70%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="w-1/2 flex justify-center items-center">
        <div className="bg-white rounded border w-90 h-90 p-6">
          <div className="text-center font-bold text-xl">
            <p>Welcome To Second Brain</p>
            <p>Please Sign In</p>
          </div>
          <div className="mx-auto mt-7 max-w-60">
            <Input refence={usernameRef} type="text" placeholder="Username" />
            <Input
              refence={passwordRef}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-center items-center gap-2 mt-7">
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
            className="flex justify-center items-center mt-3 hover:underline"
            href="/signup"
          >
            Create an account?
          </a>
        </div>
      </div>
    </div>
  );
}
