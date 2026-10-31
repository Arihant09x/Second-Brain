import { CrossIcon } from "./Icons/CrossIcon";
import Button from "./Button";
import { Input } from "./Input";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import { LinkedinIcon } from "./Icons/linkedinIcon";
import { RedditsIcon } from "./Icons/redditsIcon";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import { useSnackbar } from "notistack";

interface CreateContentProps {
  open: boolean;
  onClose: () => void;
}

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Linkedin = "linkedin",
  Reddits = "reddits",
}

const contentOptions = [
  { id: ContentType.Youtube, text: "YouTube", icon: <YoutubeICon /> },
  { id: ContentType.Twitter, text: "Twitter", icon: <TwitterIcon /> },
  { id: ContentType.Linkedin, text: "LinkedIn", icon: <LinkedinIcon /> },
  { id: ContentType.Reddits, text: "Reddit", icon: <RedditsIcon /> },
];

function CreateContent({ open, onClose }: CreateContentProps) {
  const [type, setType] = useState(ContentType.Youtube);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setIsSuccess(false);
        setLoading(false);
        setType(ContentType.Youtube);
      }, 300);
    }
  }, [open]);

  async function addContent() {
    setLoading(true);
    const title = titleRef.current?.value;
    const subtitle = subtitleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title || !subtitle || !link) {
      enqueueSnackbar("Please fill in all fields", {
        variant: "info",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        BACKEND_URL + "api/v1/content",
        { title, subtitle, link, type },
        { headers: { Authorization: ` ${localStorage.getItem("token")}` } }
      );

      if ([200, 201, 202].includes(response.status)) {
        enqueueSnackbar("Content added successfully!", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        enqueueSnackbar("Failed to add content. Please try again.", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error adding content:", error);
      enqueueSnackbar("An error occurred. Please check the console.", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    // --- SOLUTION: MODIFIED BACKDROP FOR BLUR EFFECT ---
    // Changed 'bg-black bg-opacity-50' to 'bg-gray-900/30' for a softer, less black overlay
    // Added 'backdrop-blur-sm' to create the frosted glass effect
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
        open ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* --- SOLUTION: MODIFIED MODAL FOR BETTER ANIMATION --- */}
      {/* Combines opacity, scale, and translate for a smooth "drop-down" effect */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out ${
          open
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Content</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                refence={titleRef}
                className="w-fit"
                type={"text"}
                placeholder={"e.g., My Awesome Video"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <Input
                refence={subtitleRef}
                type={"text"}
                placeholder={"A short description"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <Input
                refence={linkRef}
                type={"text"}
                placeholder={"https://... URL of the content"}
              />
            </div>
          </div>

          {/* Modern Type Selection */}
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {contentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setType(option.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:cursor-pointer ${
                    type === option.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`text-2xl ${type === option.id ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${type === option.id ? "text-blue-800" : "text-gray-700"}`}
                  >
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2">
            <Button
              variant="primary"
              className="hover:cursor-pointer"
              size="md"
              onClick={addContent}
              text={"Add Content"}
              loading={isLoading}
              fullwidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateContent;
