import { useState } from "react";

// Shows the first `limit` characters of long text with a "Read more" button.
function ExpandableText({ text, limit = 260, className = "" }) {
  const [expanded, setExpanded] = useState(false);

  const value = String(text ?? "");
  const isLong = value.length > limit;
  const shown =
    !isLong || expanded ? value : `${value.slice(0, limit).trimEnd()}...`;

  return (
    <div className={className}>
      <p className="quote">{shown}</p>
      {isLong && (
        <button
          type="button"
          className="link-btn"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default ExpandableText;
