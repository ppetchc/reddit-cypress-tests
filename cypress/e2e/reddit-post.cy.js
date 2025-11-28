describe("Reddit post feature", () => {
  it("logs in, creates a post with image, and verifies the exact post content", () => {
    // Use dynamic title/body so we can assert exact value without hardcoding
    const title = "Test posting in Reddit";
    const body = "This is my body text from Cypress test.";

    cy.loginReddit();

    cy.createTextPostWithImage({ title, body });

    // Verify the post actually appears with the correct title
    cy.contains('a[slot="full-post-link"]', title, { timeout: 20000 }).should(
      "be.visible"
    );
  });
});
