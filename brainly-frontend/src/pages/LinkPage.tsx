import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import CreateContent from "../components/ContentModal";
import { ShareModal } from "../components/ShareModal";
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
        // Clear input fields
        if (titleRef.current) titleRef.current.value = "";
        if (urlRef.current) urlRef.current.value = "";
        fetchLinks();
      } else {
        setErrorMessage("Failed to add link");
        setSuccessMessage(null);
      }
    } catch (error) {
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
    <div className="flex flex-row min-h-screen bg-[#f9fbfc]">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 items-center px-4 py-8 overflow-x-auto">
        {/* Modals */}
        <CreateContent
          open={ContentmodalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={ShareModalopen}
          ShareonClose={() => setShareModalOpen(false)}
        />

        {/* Add Link Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Add a New Link
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addLink();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Title Field */}
              <div className="relative">
                <input
                  ref={titleRef}
                  id="title"
                  type="text"
                  placeholder=" "
                  className={`peer block w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 transition ${errorMessage && !titleRef.current?.value ? "border-red-400 ring-red-200" : "border-gray-300 focus:border-blue-500 ring-blue-100"}`}
                />
                <label
                  htmlFor="title"
                  className="absolute left-4 top-3 text-gray-500 duration-200 transform -translate-y-4 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 bg-white px-1 pointer-events-none"
                >
                  Title
                </label>
                {errorMessage && !titleRef.current?.value && (
                  <p className="mt-2 text-sm text-red-500 animate-fade-in">
                    Title is required
                  </p>
                )}
              </div>
              {/* URL Field */}
              <div className="relative">
                <input
                  ref={urlRef}
                  id="url"
                  type="text"
                  placeholder=" "
                  className={`peer block w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 transition ${errorMessage && !urlRef.current?.value ? "border-red-400 ring-red-200" : "border-gray-300 focus:border-blue-500 ring-blue-100"}`}
                />
                <label
                  htmlFor="url"
                  className="absolute left-4 top-3 text-gray-500 duration-200 transform -translate-y-4 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 bg-white px-1 pointer-events-none"
                >
                  URL
                </label>
                {errorMessage && !urlRef.current?.value && (
                  <p className="mt-2 text-sm text-red-500 animate-fade-in">
                    URL is required
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
            >
              Add Link
            </button>
            {/* Success/Error Messages */}
            {successMessage && (
              <p className="text-green-600 mt-3 text-center animate-fade-in">
                {successMessage}
              </p>
            )}
            {errorMessage &&
              titleRef.current?.value &&
              urlRef.current?.value && (
                <p className="text-red-500 mt-3 text-center animate-fade-in">
                  {errorMessage}
                </p>
              )}
          </form>
        </div>

        {/* Links Grid */}
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Your Links
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <ClipLoader />
            </div>
          ) : links.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map(({ _id, title, url }) => (
                <div
                  key={_id}
                  className="relative bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow border border-transparent hover:border-red-400 hover:-translate-y-1 h-full flex flex-col"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 mr-2 break-all line-clamp-2">
                      {title}
                    </h3>
                    <button
                      onClick={() => deleteLink(_id)}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline break-all"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <div className="text-5xl mb-4">🔗</div>
              <div className="font-medium text-lg">No Links Available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkPage;
