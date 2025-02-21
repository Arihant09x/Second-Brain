import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import CreateContent from "../components/ContentModal";
import { ShareModal } from "../components/ShareModal";
import Button from "../components/Button";
import { Input } from "../components/Input";
import { ClipLoader } from "react-spinners";
import { DeleteIcon } from "../components/Icons/DeleteIcon";
import { BACKEND_URL } from "../config";

const LinkPage = () => {
  const [ContentmodalOpen, setContentModalOpen] = useState(false);
  const [ShareModalopen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "api/v1/links", {
        headers: {
          Authorization: ` ${localStorage.getItem("token")}`,
        },
      });
      setLinks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching links:", error);
      setErrorMessage("An error occurred while fetching links");
      setLoading(false);
    }
  };

  const addLink = async () => {
    const title = titleRef.current?.value;
    const url = urlRef.current?.value;

    if (!title || !url) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage(null);
      return;
    }

    try {
      const response = await axios.post(
        BACKEND_URL + "api/v1/links",
        { title, url },
        {
          headers: {
            Authorization: ` ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Link added successfully");
        setErrorMessage(null);
        fetchLinks();
      } else {
        setErrorMessage("Failed to add link");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error adding link:", error);
      setErrorMessage("An error occurred while adding the link");
      setSuccessMessage(null);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await axios.delete(BACKEND_URL + `api/v1/links/${id}`, {
        headers: {
          Authorization: ` ${localStorage.getItem("token")}`,
        },
      });
      fetchLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
      setErrorMessage("An error occurred while deleting the link");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col items-center bg-[#f9fbfc] p-4 md:p-8">
        <CreateContent
          open={ContentmodalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={ShareModalopen}
          ShareonClose={() => setShareModalOpen(false)}
        />
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add a New Link
          </h2>
          <div className="space-y-4 sm:flex ">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <Input refence={titleRef} type="text" placeholder="Title" />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="url"
              >
                URL
              </label>
              <Input refence={urlRef} type="text" placeholder="URL" />
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            text="Add Link"
            onClick={addLink}
          />
          {successMessage && (
            <p className="text-green-500 mt-4 text-center">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
          )}
        </div>

        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Links</h2>
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <ClipLoader />
            </div>
          ) : links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-25 sm:ml-30">
              {links.map(({ _id, title, url }) => (
                <div key={_id} className="bg-white p-4 rounded shadow-md">
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {url}
                  </a>
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      text="Delete"
                      onClick={() => deleteLink(_id)}
                      endIcon={<DeleteIcon />}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No Links Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkPage;
