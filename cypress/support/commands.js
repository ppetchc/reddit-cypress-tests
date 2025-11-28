// cypress/support/commands.js

Cypress.Commands.add("loginReddit", () => {
  const username = Cypress.env("REDDIT_USERNAME");
  const password = Cypress.env("REDDIT_PASSWORD");

  if (!username || !password) {
    throw new Error("Missing REDDIT_USERNAME or REDDIT_PASSWORD env vars");
  }

  cy.visit("/login/");

  // Selectors may change over time – inspect the page and adjust if needed.

  cy.get("faceplate-text-input#login-username") // step 1: the component
    .shadow() // step 2: go into shadow DOM
    .find('input[name="username"]') // step 3: the real input
    .type(username, { log: false }); // step 4: type username

  cy.get("faceplate-text-input#login-password")
    .shadow()
    .find('input[name="password"]')
    .type(password, { log: false });

  cy.contains("button", /log in/i).click();

  // after clicking "Log In" and submitting credentials...
  cy.get("#expand-user-drawer-button", { timeout: 10000 })
    .should("exist")
    .and("be.visible");
});

Cypress.Commands.add("createTextPostWithImage", ({ title, body }) => {
  // Go to home or your profile, where "Create Post" is available
  cy.visit("/");

  // Open the create post form
  cy.contains("a, button", /create post/i, { timeout: 20000 })
    .should("be.visible")
    .click();

  // Open the community dropdown
  cy.get("community-picker-composer#post-submit-community-picker", {
    timeout: 20000,
  })
    .shadow()
    .within(() => {
      // Open the picker
      cy.contains("button", "Select a community", { matchCase: false })
        .should("be.visible")
        .click();

      // Type into the actual search input
      cy.get("faceplate-search-input#search-input")
        .should("exist")
        .should("not.have.class", "hidden") // make sure it's shown
        .shadow()
        .find('input[placeholder="Select a community"]')
        .click()
        .type("u/LastAnomaly1", { delay: 80 });

      // Wait for the dropdown item and click it
      cy.contains(
        'faceplate-menu div[role="menuitem"] span.text-14',
        "u/LastAnomaly1",
        { timeout: 10000, matchCase: false }
      )
        .should("be.visible")
        .closest('div[role="menuitem"]')
        .click({ force: true });
    });

  // Ensure post dialog is open
  cy.get('faceplate-textarea-input[name="title"]', { timeout: 20000 })
    .shadow()
    .find('textarea[name="title"]')
    .type(title, { force: true }); // preliminary type to ensure dialog is ready

  // Text post body
  cy.get('shreddit-composer[name="body"]')
    .find(
      'div[contenteditable="true"][name="body"][data-lexical-editor="true"]'
    )
    .click()
    .type(body, { force: true });

  // Add image
  cy.get('shreddit-composer[name="body"]', { timeout: 20000 })
    .find("rte-toolbar-button-image") // light DOM child, no .shadow() yet
    .shadow() // now enter its own shadow DOM
    .find('input[type="file"][data-media-type="image"]')
    .selectFile(
      "cypress/fixtures/mountain_at_night-wallpaper-1920x1080 - Copy.jpg",
      {
        force: true,
      }
    );

  cy.get('r-post-form-submit-button[post-action-type="submit"]', {
    timeout: 20000,
  })
    .scrollIntoView() // make sure it's in viewport
    .should("be.visible")
    .shadow() // now access inside
    .find("button#inner-post-submit-button")
    .should("be.visible")
    .click();
});
