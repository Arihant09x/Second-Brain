import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function useContent() {
  const [content, setContent] = useState([]);
  function refersh() {
    axios
      .get(BACKEND_URL + "api/v1/content", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        setContent(response.data.content || response.data);
      })
      .catch((error) => console.error("Error fetching content:", error));
  }
  useEffect(() => {
    refersh();
    const interval = setInterval(() => {
      refersh();
    }, 5 * 1000);
    return clearInterval(interval);
  }, []);
  return { content, refersh };
}
