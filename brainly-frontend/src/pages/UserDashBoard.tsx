import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { ViewCards } from "../components/ViewCard";
import { ClipLoader } from "react-spinners";
import { BrainICon } from "../components/Icons/BrainIcon";
import { BACKEND_URL } from "../config";
import { UserPlus } from "lucide-react";

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
          startIcon={<UserPlus size={20} />}
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
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full max-w-screen  space-y-6">
            {content.map(({ _id, type, title, link, subtitle }, index) => (
              <div key={_id || index} className="break-inside-avoid mb-6">
                <ViewCards
                  id={_id}
                  type={type}
                  title={title}
                  link={link}
                  subtitle={subtitle}
                />
              </div>
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
