import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { ClipLoader } from "react-spinners";
import { BrainICon } from "../components/Icons/BrainIcon";
// Re-importing the icons for content selection
import { DocumentIcon2 } from "../components/Icons/DcumentIcon2";
import { YoutubeICon } from "../components/Icons/YoutubeIcon";
import { TwitterIcon } from "../components/Icons/TwitterIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { LinkIcon } from "../components/Icons/LinkchainIcon";
import { LinkedinIcon } from "../components/Icons/linkedinIcon";
import { RedditsIcon } from "../components/Icons/redditsIcon";
import { ExternalLinkIcon, SendHorizontal, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface for a single chat message
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

// Interface for the raw conversation data from the backend
interface ConversationData {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to smoothly scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get<ConversationData[]>(
          `${BACKEND_URL}api/v1/ai/conversations`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        const chatHistory = response.data
          .slice()
          .reverse()
          .flatMap((conv: ConversationData) => [
            { role: "user" as const, content: conv.question },
            { role: "ai" as const, content: conv.answer },
          ]);

        if (chatHistory.length === 0) {
          setMessages([
            {
              role: "ai",
              content:
                "Hi there! I don't have a specific name; you can think of me as your AI assistant. Select a content source below and ask me anything!",
            },
          ]);
        } else {
          setMessages(chatHistory);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Failed to load conversation history.");
        setMessages([
          {
            role: "ai",
            content:
              "Hi there! I don't have a specific name; you can think of me as your AI assistant. Select a content source below and ask me anything!",
          },
        ]);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleAskAI = async () => {
    if (!question.trim()) return;

    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}api/v1/ai/ask`,
        {
          question,
          context:
            selectedContent.length > 0 ? selectedContent.join(", ") : undefined,
          apiKey: apiKey,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      const aiMessage: ChatMessage = {
        role: "ai",
        content: response.data.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      const errorMessage = "Sorry, I ran into an error. Please try again.";
      setError(errorMessage);
      console.error("Error asking AI:", error);
      setMessages((prev) => [...prev, { role: "ai", content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  // Restoring the content options from the original code
  const contentOptions = [
    { id: "linkedin", icon: <LinkedinIcon />, text: "Linkedin" },
    { id: "reddits", icon: <RedditsIcon />, text: "Reddits" },
    { id: "documents", icon: <DocumentIcon2 />, text: "Documents" },
    { id: "youtube", icon: <YoutubeICon />, text: "YouTube" },
    { id: "twitter", icon: <TwitterIcon />, text: "Twitter" },
    { id: "links", icon: <LinkIcon />, text: "Links" },
  ];

  // Restoring the toggle function
  const toggleContentSelection = (contentId: string) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="bg-transparent  p-4 sticky top-0 z-10 mb-5">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r  rounded-xl flex items-center justify-center">
              <BrainICon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Ask Your Second Brain
              </h1>
              <p className="text-sm text-gray-500">
                Get intelligent insights from your content
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-auto p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-200"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "ai" && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BrainICon />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl shadow-sm ${message.role === "user" ? "bg-gray-900 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"}`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10  rounded-full flex items-center justify-center flex-shrink-0">
                  <BrainICon />
                </div>
                <div className="max-w-xl p-4 rounded-2xl bg-white border border-gray-200 rounded-bl-none shadow-sm">
                  <div className="flex items-center gap-2">
                    <ClipLoader size={20} color="#10b981" />
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 p-6  rounded-2xl h-40">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* --- Content Selection Re-integrated Here --- */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-md font-bold text-gray-600 mr-2">
                  Include:
                </span>
                {contentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleContentSelection(option.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                      selectedContent.includes(option.id)
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                    }`}
                  >
                    {option.icon}
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative ">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your content..."
                className="w-full bg-white border-2 border-gray-300 rounded-xl p-4 pr-20 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-base"
                disabled={loading}
                rows={1}
                style={{ minHeight: "56px" }}
              />
              <button
                onClick={handleAskAI}
                disabled={loading || !question.trim() || !apiKey}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 rounded-full text-white font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
                aria-label="Ask AI"
              >
                {loading ? (
                  <ClipLoader size={18} color="white" />
                ) : (
                  <SendHorizontal />
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blur-100 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold ">Gemini API Key</h2>
              <a
                className="flex  items-center text-sm text-gray-500  hover:text-blue-500 mb-4"
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                Get your API key here
                <ExternalLinkIcon className="inline-block ml-1" size={12} />
              </a>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setModalError(null);
                }}
                placeholder="Enter your Gemini API key"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              {modalError && (
                <p className="text-red-500 text-sm mb-4">{modalError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!apiKey.trim()) {
                      setModalError("API key cannot be empty.");
                      return;
                    }
                    if (!apiKey.startsWith("AIza")) {
                      setModalError(
                        "Invalid Gemini API key. It should start with 'AIza'."
                      );
                      return;
                    }
                    localStorage.setItem("geminiApiKey", apiKey);
                    setIsModalOpen(false);
                    setModalError(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskAI;
