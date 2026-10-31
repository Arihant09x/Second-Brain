import { DeleteIcon } from "./Icons/DeleteIcon";
import { useState } from "react";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import LabelInput from "./LabelInput";
import { SuccessIcon } from "./Icons/SuccessIcon";
import { ErrorIcon } from "./Icons/ErrorIcon";
import { XEmbed, LinkedInEmbed } from "react-social-media-embed";
import { ViewICon } from "./Icons/ViewIcon";
import { LinkedinIcon } from "./Icons/linkedinIcon";
import { RedditsIcon } from "./Icons/redditsIcon";
import { RedditEmbed } from "./redditEmbedde";
import { motion } from "framer-motion";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CardInterface {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "linkedin" | "reddits" | string;
  subtitle: string;
  onDelete: (id: string) => void;
}

const typeConfig = {
  youtube: {
    icon: <YoutubeICon />,
    borderColor: "hover:border-red-400",
    shadowColor: "hover:shadow-red-100",
  },
  twitter: {
    icon: <TwitterIcon />,
    borderColor: "hover:border-sky-400",
    shadowColor: "hover:shadow-sky-100",
  },
  linkedin: {
    icon: <LinkedinIcon />,
    borderColor: "hover:border-blue-600",
    shadowColor: "hover:shadow-blue-100",
  },
  reddits: {
    icon: <RedditsIcon />,
    borderColor: "hover:border-orange-500",
    shadowColor: "hover:shadow-orange-100",
  },
};
type CardType = "twitter" | "youtube" | "linkedin" | "reddits";

export function Cards(props: CardInterface) {
  const [errorMessage] = useState<string | null>(null);
  const [TrueOrFalse] = useState(false);
  const lowerCaseType = props.type?.toLowerCase() as CardType;

  if (!lowerCaseType || !typeConfig[lowerCaseType]) {
    console.error(
      `Invalid or missing 'type' prop for Card component. Received: '${props.type}' for item with title: '${props.title}'. Card will not be rendered.`
    );
    return null;
  }
  // --- Link Validation and Formatting Helpers ---

  const isValidYouTubeLink =
    lowerCaseType === "youtube" &&
    (props.link.includes("youtu.be") ||
      props.link.includes("youtube.com/watch"));

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop()?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/watch")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  const getLinkedinEmbedUrl = (url: string) => {
    const match = url.match(/activity-([0-9]+)/);
    if (match && match[1]) {
      const urn = `urn:li:activity:${match[1]}`;
      return `https://www.linkedin.com/embed/feed/update/${urn}`;
    }
    if (url.includes("/embed/feed/")) {
      return url;
    }
    return "";
  };

  const isValidTwitterLink =
    lowerCaseType === "twitter" &&
    (props.link.includes("twitter.com") || props.link.includes("x.com"));
  const isValidLinkedinLink =
    lowerCaseType === "linkedin" && props.link.includes("linkedin.com/posts/");
  const isValidRedditsLink =
    lowerCaseType === "reddits" && props.link.includes("reddit.com");

  async function Delete(id: string) {
    // This should call the onDelete prop passed from the parent
    try {
      await axios.delete(BACKEND_URL + `api/v1/content/${id}`, {
        headers: {
          Authorization: ` ${localStorage.getItem("token")}`,
        },
      });
      enqueueSnackbar("Post deleted successfully", {
        variant: "success",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      enqueueSnackbar("An error occurred while deleting the post", {
        variant: "error",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  }

  const currentType = typeConfig[lowerCaseType];

  return (
    // --- SOLUTION: Converted to motion.div and added animation props ---
    <motion.div
      layout // Animates layout changes (e.g., when an item is deleted)
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }} // Animation for when the card is removed
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 h-fit flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${currentType.borderColor} ${currentType.shadowColor}`}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex justify-center items-center text-center gap-3 text-lg font-medium text-gray-700">
            {currentType.icon}
            <span className="text-gray-600 font-bold">{props.title}</span>
          </div>
          <div className="flex gap-2 text-gray-500 items-center">
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              title="View Original"
              className="hover:text-blue-600 transition-colors"
            >
              <ViewICon />
            </a>
            <button
              onClick={() => Delete(props.id)}
              title="Delete"
              className="hover:text-red-400 transition-colors"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{props.subtitle}</p>
      </div>

      {/* Card Content / Embed Area */}
      <div className="flex-grow flex flex-col justify-center min-h-[100px]">
        {/* YouTube */}
        {lowerCaseType === "youtube" &&
          (isValidYouTubeLink ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full p-2 rounded-2xl"
                src={getYouTubeEmbedUrl(props.link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-4 text-center text-red-500 text-sm font-semibold">
              Invalid YouTube URL
            </div>
          ))}

        {/* Twitter */}
        {lowerCaseType === "twitter" &&
          (isValidTwitterLink ? (
            <div className="w-full px-2 sm:px-4 pb-2">
              <XEmbed url={props.link} width="100%" />
            </div>
          ) : (
            <div className="p-4 text-center text-blue-500 text-sm font-semibold">
              Invalid Twitter URL
            </div>
          ))}

        {/* LinkedIn */}
        {lowerCaseType === "linkedin" &&
          (isValidLinkedinLink ? (
            <div className="w-full px-2 sm:px-4 pb-2">
              <LinkedInEmbed
                url={getLinkedinEmbedUrl(props.link)}
                width="100%"
              />
            </div>
          ) : (
            <div className="p-4 text-center text-blue-600 text-sm font-semibold">
              Invalid LinkedIn URL
            </div>
          ))}

        {/* Reddit */}
        {lowerCaseType === "reddits" &&
          (isValidRedditsLink ? (
            <div className="w-full px-2 sm:px-4 pb-2">
              <RedditEmbed url={props.link} />
            </div>
          ) : (
            <div className="p-4 text-center text-orange-500 text-sm font-semibold">
              Invalid Reddit URL
            </div>
          ))}
      </div>

      {/* Error/Success Message */}
      {errorMessage && (
        <div className="p-4 border-t border-gray-200">
          <LabelInput
            label={errorMessage}
            success={TrueOrFalse}
            startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
          />
        </div>
      )}
    </motion.div>
  );
}
