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

  async function shareBrain() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      if (response.data.link) {
        const shareLink = `https://second-brain-frontend-nwov.onrender.com/sharebrain/${response.data.link}`;
        setShareMessage(shareLink);
        copyToClipboard(shareLink);
      } else {
        setMessage("Failed to generate link.");
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
      setMessage("An error occurred while generating the link.");
    }
  }

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied to clipboard!");
      setCountdown(3);
      console.log(shareMessage);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setMessage("");
            window.open(link, "_blank");
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setMessage("Failed to copy link.");
    }
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
            <h1 className="font-black text-xl">Share Your Second Brain</h1>
            <button onClick={ShareonClose} className="p-1">
              <CrossIcon />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400 text-center">
            Share your collection of notes, documents, tweets, and videos with
            others. They’ll be able to import your content into their own Second
            Brain.
          </p>

          {message && (
            <div className="mt-3 p-3 bg-green-100 text-green-700 text-sm rounded-md text-center transition-all animate-fadeIn ease-in-out duration-500">
              <p>{message}</p>
              {countdown !== null && <p>Redirecting in {countdown}...</p>}
            </div>
          )}

          <div className="flex justify-center items-center mt-5">
            <Button
              variant="primary"
              size="sm"
              onClick={shareBrain}
              fullwidth
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
