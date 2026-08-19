import { useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import VideoInput from "./components/VideoInput.jsx";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;

  const handleAnalyze = () => {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    if (!youtubePattern.test(youtubeUrl)) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setError("");
    console.log(youtubeUrl);
  };

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

        <p className="features">
          Transcript • Comments • NLP • AI Classification
        </p>
      </section>
    </main>
  );
}

export default App;
