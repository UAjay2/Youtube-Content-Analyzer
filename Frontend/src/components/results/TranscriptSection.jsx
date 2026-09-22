import { useState } from "react";

function TranscriptSection({ transcript }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = (transcript || "").trim();

  if (!text) {
    return (
      <section className="section-block" aria-labelledby="transcript-title">
        <h2 className="section-title" id="transcript-title">
          Transcript
        </h2>
        <p className="empty">
          No English captions were found for this video. Without them, we can't
          work out topics or a category. Videos with captions turned on, or
          auto-generated English captions, work best.
        </p>
      </section>
    );
  }

  const wordCount = text.split(/\s+/).length;

  const copyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked by the browser: nothing else to do
    }
  };

  return (
    <section className="section-block" aria-labelledby="transcript-title">
      <h2 className="section-title" id="transcript-title">
        Transcript
      </h2>
      <p className="section-lede">
        {wordCount.toLocaleString()} words of English captions.
      </p>

      <div
        className="transcript-text"
        data-expanded={expanded}
        {...(expanded
          ? { tabIndex: 0, role: "region", "aria-label": "Full transcript" }
          : {})}
      >
        <p className="quote">{text}</p>
      </div>

      <div className="transcript-actions">
        <button
          type="button"
          className="secondary-btn"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Collapse transcript" : "Show full transcript"}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={copyTranscript}
        >
          {copied ? "Copied" : "Copy transcript"}
        </button>
      </div>
    </section>
  );
}

export default TranscriptSection;
