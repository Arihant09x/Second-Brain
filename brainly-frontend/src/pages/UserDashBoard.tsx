import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { ViewCards } from "../components/ViewCard";
import { ClipLoader } from "react-spinners";
import { BrainICon } from "../components/Icons/BrainIcon";
import { LoginArrowIcon } from "../components/Icons/LoginArrow";
import { BACKEND_URL } from "../config";

export function UserDashBoard() {
  const navigate = useNavigate();
  const { shareLink } = useParams();
  const [content, setContent] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareLink) {
      fetchContent();
    }
  }, [shareLink]);

  async function fetchContent() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}api/v1/brain/${shareLink}`
      );

      setContent(response.data.Content);
      setUsername(response.data.Username || "Unknown User");
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BrainICon />
          <h1 className="text-2xl sm:text-3xl font-bold">Second Brain</h1>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/signin")}
          text="Log In"
          startIcon={<LoginArrowIcon />}
        />
      </div>

      {/* Username Section */}
      <p className="font-semibold text-lg text-center mb-4">
        <span className="font-bold underline">
          {loading ? "..." : username}
        </span>{" "}
        - Share the Brain
      </p>

      {/* Cards Section */}
      <div className="w-full flex justify-center min-h-[45vh]">
        {loading ? (
          <ClipLoader />
        ) : content.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-screen max-w-screen sm:ml-30">
            {content.map(({ _id, type, title, link, subtitle }, index) => (
              <ViewCards
                key={_id || index}
                id={_id}
                type={type}
                title={title}
                link={link}
                subtitle={subtitle}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-gray-500 w-full">
            No Content Available
          </div>
        )}
      </div>
    </div>
  );
}
