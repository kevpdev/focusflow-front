import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.baseUrl = 'http://localhost:4200';
      config.supportFile = 'cypress/support/e2e.ts';
      config.specPattern = 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}';
    },
  },
});
