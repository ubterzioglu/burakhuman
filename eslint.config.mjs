import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: ["httpdocs/**", "lastref/**", ".next/**", "node_modules/**"],
  },
];

export default config;
