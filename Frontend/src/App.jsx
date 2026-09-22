import { useEffect, useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import VideoInput from "./components/VideoInput.jsx";
import ErrorAlert from "./components/ErrorAlert.jsx";
import Loader from "./components/Loader.jsx";
import Results from "./components/results/Results.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import { useServerStatus } from "./hooks/useServerStatus.js";
import { getYouTubeVideoId } from "./utils/youTube.js";
import { siteConfig } from "./config/siteConfig.js";

const API_URL = siteConfig.apiUrl;

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState(null); // { message, hint? } or null
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const outputRef = useRef(null);
  const { status: serverStatus, recheck } = useServerStatus(API_URL);

  // Bring the loader, then the results, into view
  useEffect(() => {
    if (loading || data) {
      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;
      outputRef.current?.scrollIntoView?.({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [loading, data]);

  // urlOverride is used by the example buttons, because state updates are not instant
  const handleAnalyze = async (urlOverride) => {
    if (loading) return;

    const url = (
      typeof urlOverride === "string" ? urlOverride : youtubeUrl
    ).trim();

    setError(null);
    setData(null);

    if (!url) {
      setError({ message: "Paste a YouTube link to get started." });
      return;
    }

    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
      setError({
        message: "That doesn't look like a YouTube video link.",
        hint: "Try a link like youtube.com/watch?v=... or youtu.be/...",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        // show the backend's own message (e.g. "Video not found") when there is one
        let message = "The analysis failed.";

        try {
          const errorData = await response.json();
          if (errorData.error) {
            message = errorData.error;
          }
        } catch {
          // response was not JSON, keep the generic message
        }

        throw new Error(message);
      }

      const responseData = await response.json();
      console.log("Backend response:", responseData);
      setData(responseData);
    } catch (err) {
      console.error(err);

      // fetch() throws a TypeError when the server cannot be reached at all
      if (err instanceof TypeError) {
        setError({
          message: "Can't reach the server.",
          hint: "Start the Flask backend (python app.py), then try again.",
        });
      } else {
        setError({ message: err.message || "Something went wrong." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (url) => {
    setYoutubeUrl(url);
    handleAnalyze(url);
  };

  // The page takes on the colour of the video's category
  const dominant = data?.categories?.dominant;
  const theme =
    dominant && dominant !== "Unknown" ? dominant.toLowerCase() : undefined;

  return (
    <div className="app" id="top" data-theme={theme}>
      <a className="skip-link" href="#analyze">
        Skip to the analyzer
      </a>

      <Navbar status={serverStatus} onRecheck={recheck} />

      <main>
        <section id="analyze" className="container hero">
          <Header />

          <VideoInput
            youtubeUrl={youtubeUrl}
            setYoutubeUrl={setYoutubeUrl}
            onAnalyze={handleAnalyze}
            onExample={handleExample}
            setError={setError}
            loading={loading}
            examples={siteConfig.examples}
          />

          {error && (
            <ErrorAlert error={error} onDismiss={() => setError(null)} />
          )}
        </section>

        <div ref={outputRef} className="container output">
          {loading && <Loader />}
          {data && !loading && <Results data={data} />}
        </div>

        <HowItWorks />
        <Features />
      </main>

      <Footer />
    </div>
  );
}

export default App;
