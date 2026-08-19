export function getYouTubeVideoId(urlString) {
  try {
    const url = new URL(urlString);

    if (url.hostname === "www.youtube.com") {
      return url.searchParams.get("v");
    }
    if (url.hostname === "youtube.com") {
      return url.searchParams.get("v");
    }
    if (url.hostname == "youtu.be") {
      return url.pathname.substring(1);
    }

    return null;
  } catch {
    return null;
  }
}
