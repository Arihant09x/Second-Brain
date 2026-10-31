import { useEffect } from "react";

interface RedditEmbedProps {
  url: string;
}

// This component uses React's useEffect hook to safely load and use Reddit's external script.
export const RedditEmbed = ({ url }: RedditEmbedProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.reddit.com/widgets.js";
    script.async = true;
    script.charset = "UTF-8";

    document.body.appendChild(script);

    // This is a cleanup function that removes the script when the component is no longer on the screen.
    return () => {
      document.body.removeChild(script);
    };
  }, [url]); // The effect re-runs if the post URL changes.

  return (
    <blockquote className="reddit-embed-bq" data-embed-height="500">
      <div>
        <a href={url}>View post on Reddit </a>
      </div>
    </blockquote>
  );
};
