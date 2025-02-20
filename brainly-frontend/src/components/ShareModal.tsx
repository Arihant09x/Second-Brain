import { useState } from "react";
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
  const [shareMessage, setShareMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const { content } = useContent();
  const cardCount = Array.isArray(content) ? content.length : 0;

  console.log("Total cards:", cardCount);

  async function shareBrain() {
    try {
      const response = await axios.post(
        BACKEND_URL + "api/v1/brain/share",
        { share: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log("Generated Share Link:", response.data.link);

      if (response.data.link) {
        setShareMessage(response.data.link);
        handleShareClick(
          "https://second-brain-frontend-ahrl.onrender.com" + response.data.link
        ); // Pass the received link
      } else {
        setMessage("Failed to generate link.");
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
      setMessage("An error occurred while generating the link.");
    }
  }

  const handleShareClick = (link: string) => {
    setMessage("Link is copied to clipboard");

    // Copy message to clipboard
    navigator.clipboard.writeText(link).then(() => {
      setCountdown(3); // Start countdown

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setMessage(""); // Hide message
            window.open(link, "_blank"); // Redirect
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    });
  };

  return (
    <div>
      <div
        className={`w-screen h-screen inset-0 bg-slate-300/30 fixed top-0 left-0 backdrop-blur-xs flex justify-center items-center transition-all duration-300 ease-in-out ${
          Shareopen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{ pointerEvents: Shareopen ? "auto" : "none" }}
      >
        <div className="bg-white opacity-100 p-4 rounded-xl shadow-lg w-96">
          <div className="flex justify-between items-center">
            <h1 className="font-black font-medium text-xl">
              Share Your Second Brain
            </h1>
            <button onClick={ShareonClose} className="p-1">
              <CrossIcon />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400 text-center">
            Share your entire collection of notes, documents, tweets, and videos
            with others. They'll be able to import your content into their own
            Second Brain.
          </p>

          {/* Messages centered & stacked */}
          {message && (
            <div className="mt-3 p-3 bg-green-100 text-green-700 text-sm rounded-md text-center transition-all animate-fadeIn ease-in-out duration-500">
              <p>{message}</p>
              {countdown !== null && <p>Redirecting in {countdown}...</p>}
            </div>
          )}

          <div className="flex justify-center items-center mt-5">
            <Button
              variant="primary"
              size="md"
              onClick={shareBrain} // Fixed button click handler
              fullwidth={true}
              text="Share Brain"
              startIcon={<ContentCopyIcon />}
            />
          </div>
          <h2 className="text-xs flex justify-center items-center mt-2 text-gray-400">
            {cardCount} items will be shared
          </h2>
        </div>
      </div>
    </div>
  );
}
