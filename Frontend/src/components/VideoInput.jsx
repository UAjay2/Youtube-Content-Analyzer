function VideoInput({ youtubeUrl, setYoutubeUrl, onAnalyze, setError }) {
  return (
    <div className="analyzer">
      <input
        type="text"
        value={youtubeUrl}
        onChange={(event) => {
          setYoutubeUrl(event.target.value);
          setError("");
        }}
        placeholder="Paste your YouTube video URL"
      />

      <button onClick={onAnalyze}>Analyze Video</button>
    </div>
  );
}

export default VideoInput;
