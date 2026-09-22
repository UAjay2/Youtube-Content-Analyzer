export const siteConfig = {
  name: "YouTube Content Analyzer",
  shortName: "Content Analyzer",

  // Shown in the footer
  author: "Ajay",
  githubUrl: "https://github.com/your-username/your-repo",

  // Backend address. For a deployed site, set VITE_API_URL in your frontend .env file.
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",

  // Videos offered as one-click examples under the input
  examples: [
    {
      label: "Python tutorial",
      url: "https://www.youtube.com/watch?v=Fa_V9fP2tpU",
    },
    {
      label: "Sports moments",
      url: "https://www.youtube.com/watch?v=o7W7OvETO40",
    },
  ],
};
