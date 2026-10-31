import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import CreateContent from "../components/ContentModal";
import { ShareModal } from "../components/ShareModal";
import Button from "../components/Button";
import { ShareICon } from "../components/Icons/ShareIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { ClipLoader } from "react-spinners";
import { Cards } from "../components/Card";
import { useEffect, useState } from "react";

// Define your Content item interface
interface ContentItem {
  _id: string;
  type: string;
  title: string;
  link: string;
  subtitle: string;
  // add any other fields as necessary
}

const Linkedin = () => {
  const [ContentmodalOpen, setContentModalOpen] = useState(false);
  const [ShareModalopen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // Ensure useContent returns typed content
  const { content, refersh } = useContent() as {
    content: ContentItem[];
    refersh: () => void;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = () => {
    refersh();
  };

  // Filter content safely
  const linkedinContent = Array.isArray(content)
    ? content.filter((item) => item.type?.toLowerCase() === "linkedin")
    : [];

  return (
    <div className="flex min-h-screen bg-white dark:bg-dark-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-65 p-4 sm:p-6 pb-20 lg:pb-6">
        {/* Modals */}
        <CreateContent
          open={ContentmodalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={ShareModalopen}
          ShareonClose={() => setShareModalOpen(false)}
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-4 mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShareModalOpen(true)}
            text="Share Brain"
            startIcon={<ShareICon size="md" />}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setContentModalOpen(true)}
            text="Add Content"
            startIcon={<PlusIcon size="md" />}
          />
        </div>

        {/* Header */}
        <div className="font-bold text-gray-900 dark:text-gray-900 text-lg sm:text-xl md:text-2xl mb-6 text-center sm:text-left">
          Linkedin Posts
        </div>

        {/* Cards Section */}
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center w-full py-12">
              <ClipLoader color="#0A66C2" /> {/* LinkedIn Blue */}
            </div>
          ) : linkedinContent.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:grid-cols-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {linkedinContent.map(({ _id, type, title, link, subtitle }) => (
                <div key={_id} className="break-inside-avoid mb-4 sm:mb-6">
                  <Cards
                    id={_id}
                    type={type}
                    title={title}
                    link={link}
                    subtitle={subtitle}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 w-full py-12">
              <div className="text-6xl mb-4">💼</div> {/* Changed Icon */}
              <h3 className="text-xl font-semibold mb-2">
                No Linkedin posts yet
              </h3>
              <p className="text-sm">
                Add your first Linkedin post to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Linkedin;
