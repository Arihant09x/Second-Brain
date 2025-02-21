import { Cards } from "../components/Card";
import Button from "../components/Button";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { ShareICon } from "../components/Icons/ShareIcon";
import CreateContent from "../components/ContentModal";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import { ShareModal } from "../components/ShareModal";
import { ClipLoader } from "react-spinners";

function Dashboard() {
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { content, refersh } = useContent();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await refersh();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = () => {
    refersh();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 bg-[#f9fbfc] p-2 sm:p-4 w-full">
        <CreateContent
          open={contentModalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={shareModalOpen}
          ShareonClose={() => setShareModalOpen(false)}
        />

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-4 mt-2 ">
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

        <div className="font-bold text-neutral-800 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6  sm:-mt-10 text-center sm:text-left sm:ml-90 ">
          All Notes
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full py-4 sm:py-8">
            <ClipLoader />
          </div>
        ) : Array.isArray(content) && content.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-50 sm:ml-90">
            {content.map(({ _id, type, title, link, subtitle }, index) => (
              <Cards
                key={_id || index}
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
          <div className="flex justify-center items-center text-gray-500 w-full h-32 sm:h-40 text-center px-2">
            No Content Available
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
