import { useCallback, useEffect, useState } from "react";

// Pings /api/health when the page loads and every 30 seconds after that.
// status is "checking", "online" or "offline".
export function useServerStatus(apiUrl, intervalMs = 30000) {
  const [status, setStatus] = useState("checking");
  const [checkCount, setCheckCount] = useState(0); // bump to force a fresh ping

  useEffect(() => {
    let cancelled = false;

    const ping = () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      fetch(`${apiUrl}/api/health`, { signal: controller.signal })
        .then((response) => {
          if (!cancelled) setStatus(response.ok ? "online" : "offline");
        })
        .catch(() => {
          if (!cancelled) setStatus("offline");
        })
        .finally(() => clearTimeout(timer));
    };

    ping();
    const id = setInterval(ping, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [apiUrl, intervalMs, checkCount]);

  // Used when the person clicks the status button: show "checking", then ping again
  const recheck = useCallback(() => {
    setStatus("checking");
    setCheckCount((count) => count + 1);
  }, []);

  return { status, recheck };
}
