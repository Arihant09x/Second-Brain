import { useState, useEffect } from "react";
import Button from "./Button";
import { CrossIcon } from "./Icons/CrossIcon";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface ShareType {
  Shareopen: boolean;
  ShareonClose: () => void;
}

export function ShareModal({ Shareopen, ShareonClose }: ShareType) {
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { content } = useContent();
  const cardCount = Array.isArray(content) ? content.length : 0;

  // Reset state when modal is closed
  useEffect(() => {
    if (!Shareopen) {
      setTimeout(() => {
        setMessage("");
        setCountdown(null);
        setIsError(false);
      }, 300); // Wait for animation to finish
    }
  }, [Shareopen]);

  async function shareBrain() {
    setIsLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await axios.post(
        `${BACKEND_URL}api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      if (response.data.link) {
        // --- Use your production/deployment URL here in the future ---
        const shareLink = `http://localhost:5173/sharebrain/${response.data.link}`;
        copyToClipboard(shareLink);
      } else {
        setMessage("Failed to generate link.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
      setMessage("An error occurred while generating the link.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied to clipboard!");
      setIsError(false);
      setCountdown(3);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setMessage("");
            window.open(link, "_blank"); // Open link in a new tab
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setMessage("Failed to copy link.");
      setIsError(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
        Shareopen ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: Shareopen ? "auto" : "none" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-in-out p-5 ${
          Shareopen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-6 -mt-4">
          <h2 className="font-bold text-xl text-gray-800">
            Share Your Second Brain
          </h2>
          <button
            onClick={ShareonClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors -mr-5"
          >
            <CrossIcon />
          </button>
        </div>

        <div>
          <p className="text-center text-sm text-gray-600">
            Generate a unique link to share your collection of notes, documents,
            and videos. Others can use this link to import your content.
          </p>

          {message && (
            <div
              className={`mt-4 p-3 text-sm rounded-lg text-center transition-all ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              <p>{message}</p>
              {countdown !== null && (
                <p className="font-semibold mt-1 w-full">
                  Opening link in {countdown}...
                </p>
              )}
            </div>
          )}

          <div className="mt-2">
            <Button
              variant="primary"
              className=" cursor-pointer "
              size="md"
              onClick={shareBrain}
              text="Generate & Copy Link"
              startIcon={<ContentCopyIcon />}
              loading={isLoading}
              fullwidth
            />
          </div>
          <p className="text-xs text-center mt-3 text-gray-500 p-3">
            {cardCount} items will be included in the share link.
          </p>
        </div>
      </div>
    </div>
  );
}
