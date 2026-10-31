import { ViewICon } from "./Icons/ViewIcon";
import { XEmbed, LinkedInEmbed } from "react-social-media-embed";
import { RedditEmbed } from "./redditEmbedde";
import { motion } from "framer-motion"; // --- SOLUTION: Import motion

// --- SOLUTION: Import all necessary icons ---
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import { LinkedinIcon } from "./Icons/linkedinIcon";
import { RedditsIcon } from "./Icons/redditsIcon";

interface ViewCardInterface {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "linkedin" | "reddits" | string;
  subtitle: string;
}
type CardType = "twitter" | "youtube" | "linkedin" | "reddits";
export function ViewCards(props: ViewCardInterface) {
  const lowerCaseType = props.type?.toLowerCase() as CardType;

  const typeConfig = {
    youtube: { icon: <YoutubeICon /> },
    twitter: { icon: <TwitterIcon /> },
    linkedin: { icon: <LinkedinIcon /> },
    reddits: { icon: <RedditsIcon /> },
  };

  const currentType = typeConfig[lowerCaseType];

  if (!currentType) {
    console.error(
      `Invalid 'type' prop in ViewCards. Received: '${props.type}' for item: '${props.title}'.`
    );
    return null;
  }

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

  return (
    // --- SOLUTION: Converted to motion.div and added animation props ---
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="p-4 bg-white rounded-md shadow-sm border-gray-200 max-w-sm border h-full flex flex-col"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center text-xl font-medium mr-2 text-gray-700">
          <span className="mr-2">{currentType.icon}</span>
          <span className="truncate">{props.title}</span>
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
        </div>
      </div>
      <div className="pt-1 text-xs">
        <p className="pl-3 text-gray-600 line-clamp-2">{props.subtitle}</p>
      </div>

      <div className="pt-4 flex-grow flex flex-col justify-center min-h-[100px]">
        {/* YouTube Embed */}
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

        {/* Twitter Embed */}
        {lowerCaseType === "twitter" &&
          (isValidTwitterLink ? (
            <div className="w-full px-2 sm:px-4 pb-2">
              <XEmbed url={props.link} width="100%" />
            </div>
          ) : (
            <div className="p-4 text-center text-sky-500 text-sm font-semibold">
              Invalid Twitter URL
            </div>
          ))}

        {/* LinkedIn Embed */}
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

        {/* Reddit Embed */}
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
    </motion.div>
  );
}
