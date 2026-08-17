import { useState } from "react";
import "./App.css";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleAnalyze = () => {
    console.log(youtubeUrl);
  };

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">AI-POWERED VIDEO ANALYSIS</p>

        <h1>YouTube Content Analyzer</h1>

        <p className="description">
          Understand what a YouTube video is about using its transcript and
          comments.
        </p>

        <div className="analyzer">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="Paste your YouTube video URL"
          />

          <button onClick={handleAnalyze}>Analyze Video</button>
        </div>

        <p className="features">
          Transcript • Comments • NLP • AI Classification
        </p>
      </section>
    </main>
  );
}

export default App;
