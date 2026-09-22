import { formatPercent } from "../../utils/format.js";

const ORDER = ["Positive", "Negative", "Neutral"];

function Donut({ segments, total }) {
  return (
    <div className="donut">
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label="Share of positive, negative and neutral comments"
      >
        <circle
          className="donut-track"
          cx="60"
          cy="60"
          r="48"
          pathLength="100"
        />
        {segments.map((segment) => (
          <circle
            key={segment.key}
            className="donut-seg"
            data-key={segment.key}
            cx="60"
            cy="60"
            r="48"
            pathLength="100"
            strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
            strokeDashoffset={-segment.start}
          />
        ))}
      </svg>
      <div className="donut-center">
        <strong>{total}</strong>
        <span>comments</span>
      </div>
    </div>
  );
}

function SentimentPanel({ sentiment }) {
  const counts = sentiment?.counts || {};
  const percentages = sentiment?.percentages || {};
  const total = ORDER.reduce((sum, key) => sum + (Number(counts[key]) || 0), 0);

  const segments = [];
  let running = 0;
  for (const key of ORDER) {
    const percentage = Number(percentages[key]) || 0;
    segments.push({ key, percentage, start: running });
    running += percentage;
  }

  return (
    <section className="panel" aria-labelledby="sentiment-title">
      <h2 className="panel-title" id="sentiment-title">
        How commenters feel
      </h2>

      {total === 0 ? (
        <p className="empty">
          There are no comments to score. Comments may be turned off for this
          video.
        </p>
      ) : (
        <>
          <p className="panel-lede">
            Each comment is scored as positive, negative or neutral.
          </p>

          <div className="sentiment-body">
            <Donut segments={segments} total={total} />

            <ul className="legend">
              {segments.map((segment) => (
                <li key={segment.key} data-key={segment.key}>
                  <span className="legend-dot" aria-hidden="true" />
                  <span className="legend-name">{segment.key}</span>
                  <span className="legend-value">
                    {counts[segment.key] ?? 0} (
                    {formatPercent(segment.percentage)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

export default SentimentPanel;
