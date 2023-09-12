import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
  },
});
