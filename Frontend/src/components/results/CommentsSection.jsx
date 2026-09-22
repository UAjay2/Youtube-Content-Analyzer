import { useState } from "react";
import ExpandableText from "../ExpandableText.jsx";
import { formatScore } from "../../utils/format.js";

const FILTERS = ["All", "Positive", "Negative", "Neutral"];
const PAGE_SIZE = 10;

// The 3 highest-scoring comments, skipping repeats of the same text (spam is common)
function topByScore(results, keep, compare) {
  const seen = new Set();

  return results
    .filter(keep)
    .sort(compare)
    .filter((item) => {
      const key = item.comment.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

function Highlight({ title, tone, items }) {
  if (items.length === 0) return null;

  return (
    <div className="highlight" data-tone={tone}>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${tone}-${index}`}>
            <ExpandableText text={item.comment} limit={200} />
            <span className="score">{formatScore(item.compound)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentsSection({ results }) {
  const [filter, setFilter] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (results.length === 0) {
    return (
      <section className="section-block" aria-labelledby="comments-title">
        <h2 className="section-title" id="comments-title">
          Comments
        </h2>
        <p className="empty">
          There are no comments to show. Comments may be turned off for this
          video.
        </p>
      </section>
    );
  }

  const countFor = (name) =>
    name === "All"
      ? results.length
      : results.filter((item) => item.sentiment === name).length;

  const filtered =
    filter === "All"
      ? results
      : results.filter((item) => item.sentiment === filter);
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  const mostPositive = topByScore(
    results,
    (item) => item.compound > 0,
    (a, b) => b.compound - a.compound,
  );
  const mostNegative = topByScore(
    results,
    (item) => item.compound < 0,
    (a, b) => a.compound - b.compound,
  );

  const chooseFilter = (name) => {
    setFilter(name);
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="section-block" aria-labelledby="comments-title">
      <h2 className="section-title" id="comments-title">
        Comments
      </h2>
      <p className="section-lede">
        {results.length} comments were scored. The score runs from -1 (very
        negative) to +1 (very positive).
      </p>

      {(mostPositive.length > 0 || mostNegative.length > 0) && (
        <div className="highlights">
          <Highlight
            title="Most positive"
            tone="Positive"
            items={mostPositive}
          />
          <Highlight
            title="Most negative"
            tone="Negative"
            items={mostNegative}
          />
        </div>
      )}

      <div className="tabs" role="group" aria-label="Filter comments by mood">
        {FILTERS.map((name) => (
          <button
            key={name}
            type="button"
            className="tab"
            aria-pressed={filter === name}
            onClick={() => chooseFilter(name)}
          >
            {name}
            <span className="tab-count">{countFor(name)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="empty">No {filter.toLowerCase()} comments.</p>
      ) : (
        <ul className="comment-list">
          {shown.map((item, index) => (
            <li className="comment" key={`${filter}-${index}`}>
              <div className="comment-meta">
                <span className="badge" data-sentiment={item.sentiment}>
                  {item.sentiment}
                </span>
                <span className="score">{formatScore(item.compound)}</span>
              </div>
              <ExpandableText text={item.comment} limit={300} />
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div className="more-row">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, remaining)} more ({remaining} left)
          </button>
        </div>
      )}
    </section>
  );
}

export default CommentsSection;
