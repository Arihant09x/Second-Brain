import { TwitterIcon } from "./Icons/TwitterIcon";
import { SidebarItems } from "./SidebarItems";
import { YoutubeICon } from "./Icons/YoutubeIcon";
import { LinkIcon } from "./Icons/LinkchainIcon";
import { BrainICon } from "./Icons/BrainIcon";
import { Logout } from "./Icons/Logout";
import { useNavigate } from "react-router-dom";
import FeedbackIcon from "./Icons/FeedbackIcon";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-t-gray-200  shadow-sm w-full fixed bottom-0 lg:w-72 lg:h-screen lg:fixed lg:left-0 lg:top-0 pl-3 transition-all duration-300 flex lg:flex-col items-center overflow-x-auto lg:overflow-visible">
      <div
        className="flex items-center gap-2 mt-1 hover:cursor-pointer p-3 lg:p-1"
        onClick={() => {
          navigate("/Dashboard");
        }}
      >
        <BrainICon />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Second Brain
        </h1>
      </div>

      <div className="flex lg:flex-col justify-start lg:justify-start p-4 lg:p-7 sm:gap-1 gap-6 overflow-x-auto w-full lg:w-auto">
        <SidebarItems
          onClick={() => navigate("/Dashboard/twitter")}
          text="Twitter"
          Icon={<TwitterIcon />}
        />
        <SidebarItems
          onClick={() => navigate("/Dashboard/youtube")}
          text="Youtube"
          Icon={<YoutubeICon />}
        />
        <SidebarItems
          onClick={() => navigate("/Dashboard/link")}
          text="Links"
          Icon={<LinkIcon />}
        />
        <SidebarItems
          onClick={() => navigate("/feedback")}
          text="Feedback"
          Icon={<FeedbackIcon />}
        />
        <SidebarItems
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/signin");
          }}
          text="Logout"
          Icon={<Logout />}
        />
      </div>
    </div>
  );
}
