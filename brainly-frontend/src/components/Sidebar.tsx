"use client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// --- Icons (Using your original custom imports) ---
import { BrainICon } from "./Icons/BrainIcon";
import { Logout } from "./Icons/Logout";
import { SparklesIcon } from "./Icons/SendIcon";
import { DocumentIcon2 } from "./Icons/DcumentIcon2";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { TwitterIcon } from "./Icons/TwitterIcon";
import { LinkIcon } from "./Icons/LinkchainIcon";
import { LinkedinIcon } from "./Icons/linkedinIcon";
import { RedditsIcon } from "./Icons/redditsIcon";
import { Avatar, AvatarFallback } from "./AvatarDemo";

// --- Self-contained SidebarItems component for the new design ---
const SidebarItems = ({ text, Icon, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-slate-600 hover:bg-slate-200"
    }`}
  >
    {/* Wrapper span to ensure consistent icon spacing */}
    <span className="mr-3">{Icon}</span>
    <span className="flex-1 text-left">{text}</span>
  </button>
);

// --- Simple SVG for the "Hide" icon to avoid new dependencies ---

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{
    username: string | null;
  }>({
    username: null,
  });

  // --- FIX: Use useEffect to get user data from localStorage on load ---
  useEffect(() => {
    const username = location.state?.username;
    setUser({
      username: username,
    });
  }, [location.state]);

  const currentPath = location.pathname;

  // --- YOUR ORIGINAL sidebarNavItems data ---
  const sidebarNavItems = [
    { href: "/Dashboard/ask-ai", text: "Ask AI", icon: <SparklesIcon /> },
    {
      href: "/Dashboard/documents",
      text: "Documents",
      icon: <DocumentIcon2 />,
    },
    { href: "/Dashboard/youtube", text: "YouTube", icon: <YoutubeICon /> },
    { href: "/Dashboard/twitter", text: "Twitter", icon: <TwitterIcon /> },
    { href: "/Dashboard/linkedin", text: "LinkedIn", icon: <LinkedinIcon /> },
    { href: "/Dashboard/reddits", text: "Reddit", icon: <RedditsIcon /> },
    { href: "/Dashboard/link", text: "Links", icon: <LinkIcon /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col lg:h-screen lg:w-64 lg:border-r lg:border-slate-200 bg-slate-50 p-4">
      {/* --- Header: Your original content with the new design --- */}
      <div
        className="flex items-center gap-3 p-2 rounded-lg hover:cursor-pointer"
        onClick={() => navigate("/Dashboard")}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg  text-white">
          <BrainICon />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Second Brain</h1>
      </div>
      <hr className="border-gray-500 w-full" />
      {/* --- Navigation Links: Your original list with the new design --- */}
      <nav className="mt-4 flex-1">
        <ul className="space-y-2">
          {sidebarNavItems.map((item) => (
            <li key={item.text}>
              <SidebarItems
                onClick={() => navigate(item.href)}
                text={item.text}
                Icon={item.icon}
                isActive={currentPath === item.href}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className="border-t border-gray-300 mx-[-1rem]"></div>
        <div className="flex items-center justify-between ">
          <div className="pt-2 flex items-center gap-3 flex-1 overflow-hidden">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <Avatar>
                {/* --- FIX: Use user state for src and alt --- */}
                <AvatarFallback>
                  {/* --- FIX: Use user state for fallback initial --- */}
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <p className="truncate text-md font-semibold text-slate-800">
                {/* --- FIX: Use user state for username --- */}
                {user.username || "Welcome"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-10 text-slate-500 rounded-2xl hover:bg-gray-200 transition-colors duration-200"
              title="Logout"
            >
              <Logout />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
