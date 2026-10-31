import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Logout } from "./Icons/Logout";

interface UserAvatarProps {
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (!user) return null;

  const firstLetter = (user.name || user.username || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 cursor-pointer">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name || user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {firstLetter}
          </div>
        )}
        <span className="text-red-500  text-sm font-bold">
          {user.name || user.username}
        </span>
      </div>

      {isHovered && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
          >
            <Logout />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
