# Reddit Cypress Tests

This repository contains automated end-to-end tests for Reddit using **Cypress**.  
The main scenario covered is:

- Logging in to Reddit
- Creating a text post with an image
- Verifying that the post appears with the correct title

## Prerequisites

Before you can run the tests, make sure you have the following installed:

- **Node.js** – Required to run Cypress.  
  Download from the [official Node.js website](https://nodejs.org/).

- **Git** – To clone this repository and work with version control.  
  Download from [https://git-scm.com/](https://git-scm.com/).

- **Reddit test account** – The tests log in to Reddit, so you’ll need:
  - A username
  - A password
  - (Optional) Make sure 2FA is disabled for this test account to avoid manual steps.

## Getting Started

1. **Clone the repository**

   First, clone the repository to your local machine:
      ```bash
       git clone https://github.com/ppetchc/reddit-cypress-tests.git
       cd reddit-cypress-tests
      ```
2. **Install dependencies**

   Install the project dependencies (including Cypress):
      ```bash
       npm install
      ```
3. **Configure environment variables**

   The tests expect Reddit credentials to be stored in the Cypress environment variables.

   Create a file named `cypress.env.json` in the project root with content like:
      ```bash
       {
         "REDDIT_USERNAME": "your-reddit-username",
         "REDDIT_PASSWORD": "your-reddit-password"
       }
      ```
## Running the Tests

1. **Open Cypress UI**:

   To run the tests in the Cypress Test Runner, open the Cypress UI by executing the following command:
      ```bash
       npx cypress open
      ```
   Then in the Cypress window, select:

   - E2E Testing
   - Choose any available browser (for example **Chrome**, **Edge**, or **Electron**).
   - The spec file, e.g. `cypress/e2e/reddit-post.cy.js`

   or run the tests directly from the terminal using `npx cypress run --browser chrome`

2. **Run tests in headless mode**

   To run all tests from the command line without UI:
      ```bash
       npx cypress run
      ```
    This will run all the tests in the command line interface and display the results.

    To run just the Reddit post spec:
    ```bash
      npx cypress run --spec "cypress/e2e/reddit-post.cy.js"
    ```
## Test Structure

The main flow is:

- `cy.loginReddit()`  
  Custom command that logs in using `REDDIT_USERNAME` and `REDDIT_PASSWORD`.

- `cy.createTextPostWithImage({ title, body })`  
  - Opens the “Create post” form
  - Selects the target profile/community from the dropdown    
  - Fills in the title and body  
  - Uploads an image from `cypress/fixtures`  
  - Submits the post

- **Verification**  
  After posting, the test asserts that the new post appears, for example by checking
  that the post list contains a link or element with the expected title text.

## Known Issues / Flaky Areas

### 1. Reddit anti-bot / rate limiting

Reddit may occasionally show intermediate pages such as:

- “Try again later”
- Additional verification/bot checks

This can cause tests to fail even when the code is correct.

Workarounds:

- Use a dedicated low-traffic test account.
- Avoid running tests too frequently in a short period.
- Add checks for error pages and either retry or fail with a clear message.

### 2. Dynamic UI & timing issues

Some elements (dropdowns, rich text editor, image upload buttons) may:

- Be rendered inside shadow DOM
- Take time to become interactable
- Require scrolling into view

The tests handle this by:

- Using higher timeouts with `cy.contains()` / `cy.get()`
- Using `.scrollIntoView()` before clicking when needed
- Typing into the search box, then selecting from the dropdown list

If Reddit updates their UI, you may need to:

- Update selectors used in `cy.get()` / `cy.contains()`
- Adjust waits and assertions.
