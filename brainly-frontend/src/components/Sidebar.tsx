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
    <div className=" h-screen bg-white border-b-gray-200 shadow-sm w-76 fixed left-0 top-0 pl-3 ">
      <div
        className="flex items-center gap-2 mt-1 hover:cursor-pointer"
        onClick={() => {
          navigate("/Dashboard");
        }}
      >
        <BrainICon />
        <h1 className="text-3xl font-bold">Second Brain</h1>
      </div>
      <div className="p-7 ">
        <SidebarItems
          onClick={() => {
            navigate("/Dashboard/twitter");
          }}
          text="Twitter"
          Icon={<TwitterIcon />}
        />
        <SidebarItems
          onClick={() => {
            navigate("/Dashboard/youtube");
          }}
          text="Youtube"
          Icon={<YoutubeICon />}
        />
        <SidebarItems
          onClick={() => {
            navigate("/Dashboard/link");
          }}
          text="Links"
          Icon={<LinkIcon />}
        />

        <SidebarItems
          onClick={() => {
            navigate("/feedback");
          }}
          text="feedback"
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
