import { useState } from "react";
import "./App.css";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  return (
    <div>
      <h1>YouTube Content Analyzer</h1>

      <p>Analyze a YouTube Video Content With AI</p>

      <input
        type="text"
        value={youtubeUrl}
        onChange={(event) => setYoutubeUrl(event.target.value)}
        placeholder="Paste Your YouTube Link"
      />
      <br />

      <button onClick={() => console.log(youtubeUrl)}>Analyze Video</button>
    </div>
  );
}
export default App;
