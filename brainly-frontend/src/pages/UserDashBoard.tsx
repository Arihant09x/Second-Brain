import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import { ViewCards } from "../components/ViewCard";
import { ClipLoader } from "react-spinners";
import { BrainICon } from "../components/Icons/BrainIcon";
import { LoginArrowIcon } from "../components/Icons/LoginArrow";

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
        `http://localhost:5000/api/v1/brain/${shareLink}`
      );
      console.log("Fetched Content:", response.data.Content);
      setContent(response.data.Content);
      setUsername(response.data.Username);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-2 mb-10">
      <div className="flex items-center gap-2 mt-1">
        <BrainICon />
        <h1 className="text-3xl font-bold">Second Brain</h1>
      </div>
      <div className="absolute top-4 right-4">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            navigate("/signin");
          }}
          text="Login In"
          startIcon={<LoginArrowIcon />}
        />
      </div>

      <p className="flex font-semibold ml-12">
        <p className="font-bold text-md underline">
          {" "}
          {loading ? "..." : username || "No username available"}
        </p>
        -Share the Brain{" "}
      </p>

      <div className="flex justify-center items-center h-[45vh] gap-4">
        {loading ? (
          <ClipLoader />
        ) : Array.isArray(content) && content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ml-35">
            {content.map(({ _id, type, title, link, subtitle }, index) => (
              <ViewCards
                key={index}
                id={_id}
                type={type}
                title={title}
                link={link}
                subtitle={subtitle}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-center text-gray-500 w-full">
            No Content Available
          </div>
        )}
      </div>
    </div>
  );
}
