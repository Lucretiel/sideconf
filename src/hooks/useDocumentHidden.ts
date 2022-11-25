import { useCallback, useState } from "react";
import useAbortEffect from "./useAbortEffect";

/// A hook that subscribes to document visibility. Returns false if
/// document.visibilityState is "hidden".
const useDocumentHidden = () => {
  const [hidden, setHidden] = useState(document.visibilityState === "hidden");

  useAbortEffect(
    useCallback((signal: AbortSignal) => {
      document.addEventListener(
        "visibilitychange",
        (ev) => setHidden(document.visibilityState === "hidden"),
        { passive: true, signal }
      );
    }, [])
  );

  return hidden;
};

export default useDocumentHidden;
