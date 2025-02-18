import React, { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import { Sidebar } from "../components/Sidebar";
import CreateContent from "../components/ContentModal";
import { ShareModal } from "../components/ShareModal";
import Button from "../components/Button";
import { ShareICon } from "../components/Icons/ShareIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { ClipLoader } from "react-spinners";
import { Cards } from "../components/Card";

const Youtube = () => {
  const [ContentmodalOpen, setContentModalOpen] = useState(false);
  const [ShareModalopen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { content, refersh } = useContent();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id: string) => {
    refersh();
  };

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen -mt-2 bg-[#f9fbfc]">
        <CreateContent
          open={ContentmodalOpen}
          onClose={() => setContentModalOpen(false)}
        />
        <ShareModal
          Shareopen={ShareModalopen}
          ShareonClose={() => setShareModalOpen(false)}
        />
        <div className="flex justify-end mt-4 mr-4 gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShareModalOpen(true)}
            text="Share Brain"
            startIcon={<ShareICon size="md" />}
          />
          <div
            onClick={(event) => {
              event.stopPropagation();
              setContentModalOpen(true);
            }}
          >
            <Button
              variant="primary"
              size="md"
              onClick={() => {}}
              text="Add Content"
              startIcon={<PlusIcon size="md" />}
            />
          </div>
        </div>

        <div className="font-bold text-neutral-800 text-3xl mb-10 ml-110 -mt-10">
          All Notes
        </div>

        <div className="flex flex-wrap gap-4 grid-cols-5 ml-110 ">
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <ClipLoader />
            </div>
          ) : Array.isArray(content) && content.length > 0 ? (
            content
              .filter(({ type }) => type === "youtube")
              .map(({ _id, type, title, link, subtitle }, index) => (
                <div key={index} className="relative">
                  <Cards
                    id={_id}
                    type={type}
                    title={title}
                    link={link}
                    subtitle={subtitle}
                    onDelete={handleDelete}
                  />
                </div>
              ))
          ) : (
            <div className="flex justify-center items-center text-center text-gray-500 w-full">
              No Content Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Youtube;
