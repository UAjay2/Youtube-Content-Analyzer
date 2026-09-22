function VideoInput({
  youtubeUrl,
  setYoutubeUrl,
  onAnalyze,
  onExample,
  setError,
  loading,
  examples = [],
}) {
  const handleSubmit = (event) => {
    event.preventDefault(); // pressing Enter submits the form
    onAnalyze();
  };

  return (
    <>
      <form className="analyze-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="video-url">
          YouTube video link
        </label>

        <div className="input-wrap">
          <input
            id="video-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={youtubeUrl}
            disabled={loading}
            onChange={(event) => {
              setYoutubeUrl(event.target.value);
              setError(null);
            }}
            placeholder="Paste a YouTube link here"
          />

          {youtubeUrl && !loading && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setYoutubeUrl("");
                setError(null);
              }}
            >
              Clear
            </button>
          )}
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze video"}
        </button>
      </form>

      {examples.length > 0 && (
        <div className="examples">
          <span>No link handy? Try one of these:</span>
          {examples.map((example) => (
            <button
              key={example.url}
              type="button"
              className="chip-btn"
              disabled={loading}
              onClick={() => onExample(example.url)}
            >
              {example.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default VideoInput;
