import { CrossIcon } from "./Icons/CrossIcon";
import Button from "./Button";
import { Input } from "./Input";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import axios from "axios";
import LabelInput from "./LabelInput";
import { SuccessIcon } from "./Icons/SuccessIcon";
import { ErrorIcon } from "./Icons/ErrorIcon";
import { useRef, useState } from "react";

interface CreateContentProps {
  open: boolean;
  onClose: () => void;
}
enum ContentType {
  Youtube = "youtube",
  Twitter = "Twitter",
}

function CreateContent({ open, onClose }: CreateContentProps) {
  const [type, setType] = useState(ContentType.Youtube);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [TrueOrFalse, setValue] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  async function addContent() {
    setLoading(true);
    const title = titleRef.current?.value;
    const subtitle = subtitleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title || !subtitle || !link) {
      setErrorMessage("Please fill in all fields");
      setValue(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/content",
        {
          title,
          subtitle,
          link,
          type,
        },
        {
          headers: {
            Authorization: ` ${localStorage.getItem("token")}`,
          },
        }
      );

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        setErrorMessage("Content added successfully");
        setValue(true);
        setLoading(false);
        setTimeout(() => {
          onClose();
        }, 2000);
        window.location.reload();
      } else {
        setErrorMessage("Failed to add content");
        setValue(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding content:", error);
      setErrorMessage("An error occurred while adding content");
      setValue(false);
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className={`w-screen h-screen inset-0 bg-slate-300/30 fixed top-0 left-0 backdrop-blur-xs flex justify-center items-center transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div className="flex flex-col justify-center">
          <span className="bg-white opacity-100 p-4 rounded w-full shadow-lg">
            <div onClick={onClose} className="flex justify-end -mr-4 -mt-3">
              <CrossIcon />
            </div>
            <div>
              <label className="ml-1">Title</label>
              <Input refence={titleRef} type={"text"} placeholder={"Title"} />
              <label className="ml-1">Subtitle</label>
              <Input
                refence={subtitleRef}
                type={"text"}
                placeholder={"Subtitle"}
              />
              <label className="ml-1">Link</label>
              <Input refence={linkRef} type={"text"} placeholder={"Link"} />
            </div>
            <div className="mb-5 mt-2">
              <h1>Types</h1>
              <div className="flex justify-center items-center mt-5 gap-4">
                <Button
                  text="Youtube"
                  startIcon={<YoutubeICon />}
                  variant={
                    type === ContentType.Youtube ? "primary" : "secondary"
                  }
                  onClick={() => {
                    setType(ContentType.Youtube);
                  }}
                ></Button>
                <Button
                  text="Twitter"
                  startIcon={<TwitterIcon />}
                  variant={
                    type === ContentType.Twitter ? "primary" : "secondary"
                  }
                  onClick={() => {
                    setType(ContentType.Twitter);
                  }}
                ></Button>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={addContent}
                text={"Submit"}
                loading={isLoading}
              />
              {errorMessage && (
                <LabelInput
                  label={errorMessage}
                  success={TrueOrFalse}
                  startIcon={TrueOrFalse ? <SuccessIcon /> : <ErrorIcon />}
                />
              )}
            </div>
          </span>
        </div>
      </div>
    </>
  );
}
export default CreateContent;
