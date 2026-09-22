const STEPS = [
  {
    title: "Paste a link",
    text: "Any public YouTube video works, including Shorts and links copied from a phone.",
  },
  {
    title: "We read the video",
    text: "We collect its details, the top-level comments and the English captions.",
  },
  {
    title: "You see the picture",
    text: "One page shows the category, the mood of the comments and the main topics.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="container landing">
      <h2 className="landing-title">How it works</h2>

      <ol className="steps">
        {STEPS.map((step, index) => (
          <li className="step" key={step.title}>
            <span className="step-number">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowItWorks;
