import { useEffect, useState } from "react";

// The backend answers with one response at the end, so these steps advance on a
// timer to show that work is happening. They are estimates, not live progress.
const STEPS = [
  "Fetching the video details",
  "Reading the comments",
  "Scoring how commenters feel",
  "Finding topics in the captions",
  "Working out the category",
];

function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="loader" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div>
        <h2 className="loader-title">Analyzing the video</h2>
        <p className="loader-hint">
          Popular videos with lots of comments take a little longer.
        </p>

        <ol className="loader-steps">
          {STEPS.map((label, index) => (
            <li
              key={label}
              data-state={
                index < step ? "done" : index === step ? "current" : "pending"
              }
            >
              {label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Loader;
