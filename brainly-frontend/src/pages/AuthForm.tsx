import React, { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { BACKEND_URL } from "../config";
import Button from "../components/Button";
import { GoogleIcon } from "../components/Icons/GoogleIcon";
import { Input } from "../components/Input";
import { motion, Variants } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "notistack";

const LabelInput: React.FC<any> = ({ label, success, startIcon }) => (
  <div
    className={`flex items-center p-3 rounded-lg text-sm font-medium ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  >
    {startIcon && <span className="mr-2 flex-shrink-0">{startIcon}</span>}
    <span>{label}</span>
  </div>
);

const SuccessIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const ErrorIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const loginImage =
  "https://myimgs.org/storage/images/7686/Data_security_05.jpg"; // Placeholder
const signupImage = "https://imghost.online/ib/d6jmi5OzZEdbFO1_1757011414.jpg"; // Placeholder

interface AuthFormProps {
  type: "signin" | "signup";
}

const ValidationCheck = ({
  isChecked,
  text,
}: {
  isChecked: boolean;
  text: string;
}) => (
  <li
    className={`flex items-center text-sm transition-colors ${isChecked ? "text-green-600" : "text-gray-500"}`}
  >
    {isChecked ? (
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )}
    {text}
  </li>
);
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function AuthForm({ type }: AuthFormProps) {
  const isSignin = type === "signin";
  const [activeLoader, setActiveLoader] = useState<"email" | "google" | null>(
    null
  );
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectInfo, setRedirectInfo] = useState<{
    path: string;
    state: any;
  } | null>(null);
  const usernameSchema = z.string().min(3).max(10);
  const [validationChecks, setValidationChecks] = useState({
    usernameLength: false,
    passwordLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { login } = useAuth();

  useEffect(() => {
    if (redirectInfo) {
      navigate(redirectInfo.path, { state: redirectInfo.state });
    }
  }, [redirectInfo, navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      setActiveLoader("google");
      setErrorMessage(null);
      try {
        const res = await axios.post(`${BACKEND_URL}api/v1/auth/google`, {
          token: tokenResponse.access_token,
        });
        const { token: internalToken, user: userData } = res.data;
        login(userData, internalToken);
        localStorage.setItem("token", internalToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        setIsSuccess(true);
        setErrorMessage("Signed in with Google!");
        enqueueSnackbar("Sign-In with Google Successful!", {
          variant: "success",
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setRedirectInfo({
          path: "/Dashboard",
          state: { username: userData.username },
        });
      } catch (error) {
        console.error("Error during Google auth exchange:", error);
        setErrorMessage("Failed to sign in with Google. Please try again.");
        enqueueSnackbar("Failed to sign in with Google. Please try again!", {
          variant: "error",
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setIsSuccess(false);
      } finally {
        setActiveLoader(null);
      }
    },
    onError: (errorResponse: any) => {
      console.error("Google Login Failed:", errorResponse);
      setErrorMessage("Google login failed. Please try again.");
      enqueueSnackbar("Google login failed. Please try again!", {
        variant: "error",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setIsSuccess(false);
      setActiveLoader(null);
    },
  });

  const handleEmailPassword = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setActiveLoader("email");
    setErrorMessage(null);
    try {
      if (username === "" || password === "") {
        setErrorMessage("Please enter your username and password");
        setIsSuccess(false);
        setActiveLoader(null);
        return;
      }
      if (isSignin) {
        const response = await axios.post(BACKEND_URL + "api/v1/signin", {
          username,
          password,
        });
        const jwt = response.data.token;
        const userData = response.data.msg;
        if (jwt || userData) {
          login(userData, jwt);
          setIsSuccess(true);
          localStorage.setItem("token", jwt);
          localStorage.setItem("userData", JSON.stringify(userData));
          setErrorMessage("Sign-In Successful!");
          enqueueSnackbar("Sign-In Successful!", {
            variant: "success",
            autoHideDuration: 1000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
          setRedirectInfo({
            path: "/dashboard",
            state: { username: username },
          });
        } else {
          setErrorMessage("Sign-in failed. Please try again!");
          enqueueSnackbar("Sign-in failed. Please try again!", {
            variant: "error",
            autoHideDuration: 1000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
          setIsSuccess(false);
        }
      } else {
        await axios.post(BACKEND_URL + "api/v1/signup", {
          name,
          username,
          password,
        });
        setIsSuccess(true);
        setErrorMessage("Signed up successfully! Redirecting...");
        enqueueSnackbar("Sign-up Successful!", {
          variant: "success",
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.msg || "An error occurred.");
      setIsSuccess(false);
    } finally {
      setActiveLoader(null);
    }
  };

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(value);
    setValidationChecks((prev) => ({
      ...prev,
      usernameLength: usernameSchema.safeParse(value).success,
    }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setValidationChecks((prev) => ({
      ...prev,
      passwordLength: value.length >= 8 && value.length <= 20,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&#]/.test(value),
    }));
  }

  const allPasswordChecksValid =
    validationChecks.passwordLength &&
    validationChecks.uppercase &&
    validationChecks.lowercase &&
    validationChecks.number &&
    validationChecks.specialChar;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <motion.div
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl bg-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Image Panel */}
        <motion.div
          className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white md:flex"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src={isSignin ? loginImage : signupImage}
            alt={isSignin ? "Sign In" : "Sign Up"}
            className="w-full max-w-xs rounded-xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-3xl font-bold"
          >
            Welcome to Second Brain
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-center text-indigo-100"
          >
            Your personal knowledge base, supercharged.
          </motion.p>
        </motion.div>

        {/* Animated Form Panel */}
        <motion.div
          className="w-full p-8 md:w-1/2 flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800"
          >
            {isSignin ? "Sign In" : "Create Account"}
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-2 text-gray-500">
            {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              to={isSignin ? "/signup" : "/signin"}
              className="font-semibold text-blue-600 hover:underline"
            >
              {isSignin ? "Sign Up" : "Sign In"}
            </Link>
          </motion.p>

          <motion.div variants={itemVariants} className="my-6">
            <Button
              onClick={() => handleGoogleLogin()}
              text="Continue with Google"
              startIcon={<GoogleIcon />}
              loading={activeLoader === "google"}
              variant="secondary"
              fullwidth
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs font-semibold text-gray-400">OR</span>
            <hr className="flex-1 border-gray-200" />
          </motion.div>

          <div className="mt-6 space-y-4">
            {!isSignin && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  placeholder="Your full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                placeholder="Your username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                isValid={validationChecks.usernameLength}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                isValid={allPasswordChecksValid}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-6">
            <Button
              size="lg"
              type="submit"
              variant="primary"
              onClick={handleEmailPassword}
              text={isSignin ? "Sign In" : "Sign Up"}
              loading={activeLoader === "email"}
              fullwidth
            />
          </motion.div>

          {errorMessage && (
            <div className="mt-4">
              <LabelInput
                label={errorMessage}
                success={isSuccess}
                startIcon={isSuccess ? <SuccessIcon /> : <ErrorIcon />}
              />
            </div>
          )}

          {!isSignin && (password.length > 0 || username.length > 0) && (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 space-y-2"
            >
              <ValidationCheck
                isChecked={validationChecks.usernameLength}
                text="Username is 3-10 characters"
              />
              <ValidationCheck
                isChecked={validationChecks.passwordLength}
                text="Password is 8-20 characters"
              />
              <ValidationCheck
                isChecked={validationChecks.uppercase}
                text="Contains an uppercase letter"
              />
              <ValidationCheck
                isChecked={validationChecks.lowercase}
                text="Contains a lowercase letter"
              />
              <ValidationCheck
                isChecked={validationChecks.number}
                text="Contains a number"
              />
              <ValidationCheck
                isChecked={validationChecks.specialChar}
                text="Contains a special character (@$!%*?&#)"
              />
            </motion.ul>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
