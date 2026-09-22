const YOUTUBE_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
];

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeVideoId(urlString) {
  try {
    let value = (urlString || "").trim();

    if (!value) {
      return null;
    }

    if (!/^https?:\/\//i.test(value)) {
      value = `https://${value}`;
    }

    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    let videoId = null;

    if (YOUTUBE_HOSTS.includes(hostname)) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        const parts = url.pathname.split("/").filter(Boolean);

        if (
          parts.length >= 2 &&
          ["shorts", "embed", "live", "v"].includes(parts[0])
        ) {
          videoId = parts[1];
        }
      }
    } else if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    }
    return videoId && VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}
