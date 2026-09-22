import { siteConfig } from "../config/siteConfig.js";

const YEAR = new Date().getFullYear();

const BUILT_WITH = [
  "React and Vite for the page",
  "Flask for the server",
  "NLTK VADER for comment mood",
  "gensim LDA for topics",
];

function Footer() {
  return (
    <footer id="about" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2 className="footer-title">About this project</h2>
            <p>
              {siteConfig.name} reads a YouTube video&apos;s captions and
              comments, then shows what the video is about and how its audience
              reacts. Built by {siteConfig.author}.
            </p>
            <p>
              <a
                className="text-link"
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View the source on GitHub
              </a>
            </p>
          </div>

          <div>
            <h2 className="footer-title">Built with</h2>
            <ul className="built-with">
              {BUILT_WITH.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer-fine">
          {YEAR} {siteConfig.name}. Not affiliated with YouTube.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
