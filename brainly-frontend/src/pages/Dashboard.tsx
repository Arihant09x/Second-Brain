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
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-65 lg:w-60  sm:p-6 pb-20 lg:pb-6">
        <CreateContent
          open={contentModalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={shareModalOpen}
          ShareonClose={() => setShareModalOpen(false)}
        />

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

        <div className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-6 text-center sm:text-left">
          All Notes
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full py-12">
            <ClipLoader color="#3B82F6" />
          </div>
        ) : Array.isArray(content) && content.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {content.map(({ _id, type, title, link, subtitle }, index) => (
              <div
                key={_id || index}
                className="break-inside-avoid mb-4 sm:mb-6"
              >
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
          <div className="flex flex-col justify-center items-center text-gray-500 w-full py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No content yet</h3>
            <p className="text-sm">Add your first note to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
