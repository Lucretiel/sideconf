import { useEffect } from "react";

const useWakeLock = (lock: boolean) =>
  useEffect(() => {
    const wakeLock = navigator.wakeLock;
    if (wakeLock) {
      console.info("attempting to acquire wake lock");
      const lock = wakeLock
        .request("screen")
        .then((sentinel) => {
          console.info("acquired screen wake lock");
          return sentinel;
        })
        .catch((err) =>
          console.warn("failed to acquire screen wake lock", err)
        );

      return () => {
        lock.then((sentinel) => {
          if (sentinel) {
            sentinel.release();
            console.info("released screen wake lock");
          }
        });
      };
    } else {
      console.info("wake lock not supported");
    }
  }, [lock]);

export default useWakeLock;
