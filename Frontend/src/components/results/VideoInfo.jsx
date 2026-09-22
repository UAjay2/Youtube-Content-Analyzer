import { useState } from "react";
import ExpandableText from "../ExpandableText.jsx";
import { formatCompact, formatFull } from "../../utils/format.js";

function VideoInfo({ data }) {
  const [thumbFailed, setThumbFailed] = useState(false);

  const watchUrl = `https://www.youtube.com/watch?v=${data.video_id}`;
  const thumbUrl = `https://i.ytimg.com/vi/${data.video_id}/hqdefault.jpg`;

  const figures = [
    { label: "Views", value: data.views },
    { label: "Likes", value: data.likes },
    { label: "Comments", value: data.comment_count },
  ];

  return (
    <section className="video-info" aria-label="Video details">
      <a
        className="thumb"
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch this video on YouTube (opens in a new tab)"
      >
        {thumbFailed ? (
          <span className="thumb-fallback">No thumbnail available</span>
        ) : (
          <img
            src={thumbUrl}
            alt=""
            loading="lazy"
            onError={() => setThumbFailed(true)}
          />
        )}
        <span className="thumb-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M9 6.5v11l9-5.5z" fill="currentColor" />
          </svg>
        </span>
      </a>

      <div className="video-meta">
        <h2 className="video-title">{data.title}</h2>
        <p className="video-channel">{data.channel}</p>

        <dl className="figures">
          {figures.map((figure) => (
            <div className="figure" key={figure.label}>
              <dt>{figure.label}</dt>
              <dd title={formatFull(figure.value)}>
                {formatCompact(figure.value)}
              </dd>
            </div>
          ))}
        </dl>

        {data.description && (
          <ExpandableText
            className="video-description"
            text={data.description}
            limit={240}
          />
        )}

        <a
          className="text-link"
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      </div>
    </section>
  );
}

export default VideoInfo;
