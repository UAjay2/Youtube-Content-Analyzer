import { useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import VideoInput from "./components/VideoInput.jsx";
import { getYouTubeVideoId } from "./utils/youTube.js";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  const [backendStatus, setbackendStatus] = useState("");

  const handleAnalyze = async () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    if (!youtubePattern.test(youtubeUrl)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    const videoId = getYouTubeVideoId(youtubeUrl);

    if (!videoId) {
      setError("Could not extract the YouTube video Id");
      return;
    }

    setError("");
    console.log(youtubeUrl, "Video Id:", videoId);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: youtubeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis request failed");
      }

      const data = await response.json();

      console.log("Backend response:", data);

      console.log(data);
    } catch (error) {
      console.error(error);
      setError("Could not connect to backend.");
    }
  };

  const checkBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");

      if (!response.ok) {
        throw new Error("Backend request faailed");
      }
      const data = await response.json();

      setbackendStatus(data.message);
    } catch (error) {
      console.log(error);
      setbackendStatus("backend connection failed");
    }
  };

  //const sendToBackend = async () => {};-->

  return (
    <main className="app">
      <section className="hero">
        <Header />

        <VideoInput
          youtubeUrl={youtubeUrl}
          setYoutubeUrl={setYoutubeUrl}
          onAnalyze={handleAnalyze}
          setError={setError}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={checkBackend}>Check Backend</button>

        <p className="features">
          Transcript • Comments • NLP • AI Classification
        </p>
        <p>Backend Status: {backendStatus}</p>
      </section>
    </main>
  );
}

export default App;
