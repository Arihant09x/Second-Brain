import { IconProps } from "./PlusIcon";
const IConvariant = {
  sm: "size-2",
  lg: "size-6",
  md: "size-4",
};
export const ShareICon = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`${IConvariant[props.size || "sm"]} `}
    >
      <path d="M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" />
    </svg>
  );
};
