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
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#f9fbfc] p-4">
        <CreateContent
          open={contentModalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={shareModalOpen}
          ShareonClose={() => setShareModalOpen(false)}
        />

        <div className="flex justify-end mt-4 gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShareModalOpen(true)}
            text="Share Brain"
            startIcon={<ShareICon size="md" />}
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => setContentModalOpen(true)}
            text="Add Content"
            startIcon={<PlusIcon size="md" />}
          />
        </div>

        <div className="font-bold text-neutral-800 text-3xl mb-10 mt-4">
          All Notes
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full">
            <ClipLoader />
          </div>
        ) : Array.isArray(content) && content.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          <div className="flex justify-center items-center text-gray-500 w-full h-40">
            No Content Available
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
