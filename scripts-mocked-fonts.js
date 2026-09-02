const css = (family, weights) => `
${weights.map(w => `@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${w};
  font-display: swap;
  src: url(https://fonts.gstatic.com/mock/${encodeURIComponent(family)}-${w}.woff2) format('woff2');
}`).join("\n")}
`;

module.exports = {
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap": css("Space Grotesk", [500, 600, 700]),
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap": css("Inter", [400, 500, 600]),
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap": css("JetBrains Mono", [400, 500]),
};
