import { useEffect, useState } from "react";

/// A hook that subscribes to document visibility. Returns false if
/// document.visibilityState is "hidden".
const useDocumentHidden = () => {
  const [hidden, setHidden] = useState(document.visibilityState === "hidden");

  useEffect(() => {
    const updateHidden = () => setHidden(document.visibilityState === "hidden");

    document.addEventListener("visibilitychange", updateHidden, {
      passive: true,
    });

    return () => {
      document.removeEventListener("visibilitychange", updateHidden);
    };
  }, []);

  return hidden;
};

export default useDocumentHidden;
