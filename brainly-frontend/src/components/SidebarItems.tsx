import { ReactNode } from "react";

interface SidebarItemsProps {
  text?: string;
  Icon: ReactNode;
  onClick?: () => void;
}

export function SidebarItems(props: SidebarItemsProps) {
  return (
    <div className="flex items-center gap-4 font-medium text-lg cursor-pointer hover:bg-gray-200 rounded-lg max-w-52 mt-4 transition-all duration-200 p-2 w-full">
      <div onClick={props.onClick} className="text-gray-500">
        {props.Icon}
      </div>
      <div onClick={props.onClick} className="text-gray-500">
        {props.text}
      </div>
    </div>
  );
}
