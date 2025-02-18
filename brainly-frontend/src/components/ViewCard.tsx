import { DocumentIcon } from "./Icons/Document";

import { useEffect } from "react";

import { ViewICon } from "./Icons/ViewIcon";

interface ViewCardInterface {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  subtitle: string;
}

export function ViewCards(props: ViewCardInterface) {
  useEffect(() => {
    // Ensure Twitter script reloads when the component mounts
    if ((window as any).twttr) {
      (window as any).twttr.widgets.load();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).twttr) {
          (window as any).twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    }
  }, [props.link]); // Reload when the link changes

  const isValidYouTubeLink =
    props.type === "youtube" &&
    (props.link.includes("youtu.be") ||
      props.link.includes("youtube.com/watch"));

  const isValidTwitterLink =
    props.type === "twitter" && props.link.includes("twitter.com");

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border-gray-200 max-w-80 border h-full">
      <div className="flex justify-between ">
        <div className="flex items-center text-xl font-medium mr-2 text-[#848990]">
          <span className="mr-2">
            <DocumentIcon />
          </span>
          {props.title}
        </div>
        <div className="flex gap-2 text-[#848990] items-center">
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            title="view"
          >
            <ViewICon />
          </a>
        </div>
      </div>
      <div className="pt-1 text-xs">
        <li className="pl-3">{props.subtitle}</li>
      </div>
      <div className="pt-4">
        {/* YouTube Embed Logic */}
        {isValidYouTubeLink ? (
          props.link.includes("youtu.be") ? (
            <iframe
              className="w-full h-48"
              src={`https://www.youtube.com/embed/${props.link.split("/").pop()?.split("?")[0]}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <iframe
              className="w-full h-48"
              src={props.link.replace("watch?v=", "embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )
        ) : props.type === "youtube" ? (
          <div className="text-center text-red-500">
            Invalid or unsupported YouTube URL
          </div>
        ) : null}

        {/* Twitter Embed Logic */}
        {isValidTwitterLink ? (
          <blockquote className="twitter-tweet">
            <a href={props.link}></a>
          </blockquote>
        ) : props.type === "twitter" ? (
          <div className="text-center text-red-500">
            Invalid or unsupported Twitter URL
          </div>
        ) : null}
      </div>
    </div>
  );
}
