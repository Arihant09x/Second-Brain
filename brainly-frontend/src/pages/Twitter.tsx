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

const Twitter = () => {
  const [ContentmodalOpen, setContentModalOpen] = useState(false);
  const [ShareModalopen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { content, refersh } = useContent();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = () => {
    refersh();
  };

  return (
    <div className="flex min-h-screen bg-[#f9fbfc]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 p-4">
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
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-4">
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
        <div className="font-bold text-neutral-800 text-lg sm:text-xl md:text-2xl my-4 sm:ml-30 sm:-mt-10 text-center sm:text-left">
          All Notes
        </div>

        {/* Cards Section */}
        <div className=" flex justify-center items-center w-full py-4 sm:py-8 ">
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <ClipLoader />
            </div>
          ) : Array.isArray(content) && content.length > 0 ? (
            <div className="grid sm:flex sm:w-full   gap-4 sm:gap-6 mb-30 sm:ml-30">
              {content
                .filter(({ type }) => type === "Twitter")
                .map(({ _id, type, title, link, subtitle }, index) => (
                  <Cards
                    key={index}
                    id={_id}
                    type={type}
                    title={title}
                    link={link}
                    subtitle={subtitle}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center text-gray-500 w-full sm:ml-30">
              No Content Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Twitter;
