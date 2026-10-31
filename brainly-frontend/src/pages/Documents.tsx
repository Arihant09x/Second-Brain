import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import CreateContent from "../components/ContentModal";
import { ShareModal } from "../components/ShareModal";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { ClipLoader } from "react-spinners";
import { DeleteIcon } from "../components/Icons/DeleteIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ViewICon } from "../components/Icons/ViewIcon";

interface Document {
  _id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  description?: string;
}

const Documents = () => {
  const [ContentmodalOpen, setContentModalOpen] = useState(false);
  const [ShareModalopen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/v1/documents`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", file.name);
    formData.append("description", "");
    try {
      const response = await axios.post(
        `${BACKEND_URL}api/v1/documents/upload`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await axios.delete(`${BACKEND_URL}api/v1/documents/${documentId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "📄";
      case "ppt":
      case "pptx":
        return "📊";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📈";
      case "txt":
        return "📄";
      default:
        return "📁";
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-white dark:bg-dark-bg">
      {/* Sidebar */}
      <div className="w-58">
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 pb-20 lg:pb-6 overflow-hidden">
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
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
            <PlusIcon size="md" />
            <span className="ml-2">Upload Document</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Header */}
        <div className="font-bold ml-5 text-gray-900 dark:text-black text-lg sm:text-xl md:text-2xl mb-6 text-center sm:text-left">
          Documents
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3">
              <ClipLoader size={20} color="#3B82F6" />
              <span className="text-blue-700 dark:text-blue-300">
                Uploading document...
              </span>
            </div>
          </div>
        )}

        {/* Documents Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center w-full py-12">
              <ClipLoader color="#FFF700" />
            </div>
          ) : documents.length > 0 ? (
            <div
              className="
              columns-1 md:columns-2 lg:columns-3 xl:grid-cols-4 gap-4 sm:gap-1 space-y-4 sm:space-y-6
              "
            >
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="break-inside-avoid mb-4 ml-5 sm:mb-6 p-4 bg-white dark:bg-dark-surface rounded-lg shadow-sm border  dark:border-dark-border hover:shadow-md transition-shadow  border-transparent hover:border-yellow-400 hover:-translate-y-1 "
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-black truncate">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.fileType.toUpperCase()} • {doc.fileSize} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      {/* Download Button */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `${BACKEND_URL}api/v1/documents/${doc._id}/download`,
                              {
                                method: "GET",
                                headers: {
                                  Authorization:
                                    localStorage.getItem("token") || "",
                                },
                              }
                            );

                            if (!res.ok) {
                              throw new Error("Failed to download file");
                            }

                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = doc.fileName || "document";
                            a.click();
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error("Download failed:", error);
                          }
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                        title="Download"
                      >
                        <ViewICon />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center text-gray-500 dark:text-gray-400 w-full py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
              <p className="text-sm">
                Upload your first document to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
