const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.reddit.com",
    defaultCommandTimeout: 12000, // a bit higher for flaky tolerance
    video: false,
    setupNodeEvents(on, config) {
      // plugins if needed
    },
  },
});
