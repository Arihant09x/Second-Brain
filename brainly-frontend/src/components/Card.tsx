import axios from "axios";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { ShareICon } from "./Icons/ShareIcon";
import { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import LabelInput from "./LabelInput";
import { SuccessIcon } from "./Icons/SuccessIcon";
import { ErrorIcon } from "./Icons/ErrorIcon";
import { BACKEND_URL } from "../config";

interface CardInterface {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  subtitle: string;
  onDelete: (id: string) => void;
}

export function Cards(props: CardInterface) {
  const { content } = useContent();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TrueOrFalse, setValue] = useState(false);

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        if (window.twttr) {
          window.twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    }
  }, [props.link]);

  async function Delete() {
    console.log("Data is" + content);
    try {
      const response = await axios.request({
        url: BACKEND_URL + "api/v1/content",
        method: "DELETE",
        data: {
          contentId: props.id,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      props.onDelete(props.id);
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        setErrorMessage("Content Delete successfully");
        setValue(true);

        window.location.reload();
      } else {
        setErrorMessage("Failed to add content");
        setValue(false);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  }

  const isValidYouTubeLink =
    props.type === "youtube" &&
    (props.link.includes("youtu.be") ||
      props.link.includes("youtube.com/watch"));

  const isValidTwitterLink =
    props.type === "twitter" && props.link.includes("twitter.com");

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border-gray-200 max-w-80 border h-full">
      <div className="flex justify-between ">
        <div className="flex justify-center items-center gap-3 text-xl font-medium mr-2 text-[#848990]">
          {props.type == "youtube" ? <YoutubeICon /> : <TwitterIcon />}
          <span className="-mt-1"> {props.title}</span>
        </div>
        <div className="flex gap-2 text-[#848990] items-center">
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <ShareICon size="md" />
          </a>
          <div onClick={Delete}>
            <DeleteIcon />
          </div>
        </div>
      </div>
      <div className="pt-1 text-xs">
        <li className="pl-5 ">{props.subtitle}</li>
      </div>
      <div className="flex flex-wrap gap-4 grid-cols-5 ">
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
        {errorMessage && (
          <LabelInput
            label={errorMessage}
            success={TrueOrFalse}
            startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
          />
        )}
      </div>
    </div>
  );
}
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}
