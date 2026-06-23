# BDD Debugging Document
## QA Automation Training Part 3 – Day 2

---

## Simulated Failures (8 Cases)

---

### Failure 1: Element Not Found

**Scenario:** Login button click fails

**Steps to Reproduce:**
1. Navigate to `https://the-internet.herokuapp.com/login`
2. Use incorrect selector `#loginBtn` instead of `button[type="submit"]`
3. Run the login step

**Root Cause:**
The selector `#loginBtn` does not exist on the page. The actual login button uses `button[type="submit"]`.

**Failure Log:**
```
Error: locator.click: Error: strict mode violation:
  locator('#loginBtn') resolved to 0 elements
  Call log:
    - waiting for locator('#loginBtn')
```

**Fix:** Update locator in `LoginPage.ts` to `button[type="submit"]`

**Tools Used:** Playwright Trace Viewer, Screenshots

---

### Failure 2: Timeout Error

**Scenario:** Dashboard assertion times out

**Steps to Reproduce:**
1. Login with valid credentials
2. Assert `toHaveURL` with 1ms timeout
3. `await expect(page).toHaveURL('/secure', { timeout: 1 })`

**Root Cause:**
Timeout set too low (1ms). Page navigation takes ~500–2000ms. Playwright's default is 5000ms.

**Failure Log:**
```
Error: expect(received).toHaveURL(expected)
  Expected: "https://the-internet.herokuapp.com/secure"
  Received: "https://the-internet.herokuapp.com/login"
  Timeout: 1ms exceeded
```

**Fix:** Remove manual timeout or set to at least `10_000` ms. Rely on Playwright auto-wait.

**Tools Used:** Playwright Trace Viewer, Console Logs

---

### Failure 3: Assertion Mismatch

**Scenario:** Login result assertion fails due to wrong expected value

**Steps to Reproduce:**
1. Login with `tomsmith / SuperSecretPassword!`
2. Assert `login result should be "failure"` (wrong expected value)

**Root Cause:**
Scenario Outline Examples table had wrong credentials (`admin/admin123`) which the application rejects, so result was `failure` instead of expected `success`.

**Failure Log:**
```
Error: expect(received).toBe(expected)
  Expected: "success"
  Received: "failure"
  at loginSteps.ts:67
```

**Fix:** Update Examples table with correct credentials: `tomsmith / SuperSecretPassword!`

**Tools Used:** Cucumber HTML Report, Screenshots

---

### Failure 4: Incorrect Locator

**Scenario:** Form field not filled — wrong ID used

**Steps to Reproduce:**
1. Navigate to `https://demoqa.com/text-box`
2. Use locator `#fullName` instead of `#userName`
3. Call `fillField('name', 'John')`

**Root Cause:**
The actual input field ID on demoqa is `#userName`, not `#fullName`. Incorrect locator was used during initial implementation.

**Failure Log:**
```
Error: locator.fill: Error: strict mode violation:
  locator('#fullName') resolved to 0 elements
```

**Fix:** Correct locator in `FormPage.ts` to `#userName`

**Tools Used:** Chrome DevTools (Element Inspector), Playwright Codegen

---

### Failure 5: Navigation Failure

**Scenario:** Page navigation fails due to wrong URL

**Steps to Reproduce:**
1. Call `page.goto('https://demoqa.com/textbox')` (missing hyphen)
2. Assert form is visible

**Root Cause:**
URL typo — correct URL is `https://demoqa.com/text-box`. The incorrect URL returns a 404 page, so all subsequent locators fail.

**Failure Log:**
```
Error: locator.fill: Error: strict mode violation:
  locator('#userName') resolved to 0 elements
  (Page is a 404 — element does not exist)
```

**Fix:** Correct URL in `FormPage.ts` to `https://demoqa.com/text-box`

**Tools Used:** Playwright Console Logs, Network Tab in DevTools

---

### Failure 6: Missing `this.attach` — World Not Extended

**Scenario:** Screenshot attachment fails in After hook

**Steps to Reproduce:**
1. Keep `CustomWorld` as a plain class (not extending Cucumber's `World`)
2. Run a failing scenario that triggers the After hook
3. `await this.attach(screenshot, 'image/png')` is called

**Root Cause:**
`this.attach` is a method provided by Cucumber's base `World` class. If `CustomWorld` does not extend `World`, `this.attach` is `undefined`.

**Failure Log:**
```
TypeError: this.attach is not a function
  at CustomWorld.<anonymous> (fixtures/hooks.ts:42:25)
```

**Fix:** Extend `World` from `@cucumber/cucumber` in `world.ts`:
```ts
import { World, IWorldOptions } from "@cucumber/cucumber";
export class CustomWorld extends World { ... }
```

**Tools Used:** Cucumber Report, Terminal Stack Trace

---

### Failure 7: Step Definition Not Found

**Scenario:** Cucumber cannot match a Gherkin step

**Steps to Reproduce:**
1. Write step in feature file: `When user submits the form`
2. Forget to add matching step in `formSteps.ts`
3. Run tests

**Root Cause:**
No step definition matches the Gherkin text. Cucumber treats undefined steps as pending and marks the scenario as failed.

**Failure Log:**
```
? When user submits the form
  Undefined. Implement with the following snippet:
    When('user submits the form', async function () {
      // Write code here
    });
```

**Fix:** Add the missing step definition in `formSteps.ts`

**Tools Used:** Cucumber Terminal Output

---

### Failure 8: DataTable Parsing Error

**Scenario:** `rowsHash()` fails on a multi-column DataTable

**Steps to Reproduce:**
1. Write DataTable with 3 columns (not 2):
   ```
   | field | value     | extra |
   | name  | John      | abc   |
   ```
2. Call `dataTable.rowsHash()` in step definition

**Root Cause:**
`rowsHash()` only works with exactly 2 columns (key-value pairs). A 3-column table throws an error.

**Failure Log:**
```
Error: rowsHash can only be called on a data table where all rows have exactly two columns
```

**Fix:** Use `dataTable.hashes()` for multi-column tables, or keep the DataTable to exactly 2 columns.

**Tools Used:** Cucumber HTML Report, Terminal Stack Trace

---

## Simulated Timeouts (3 Types)

---

### Timeout 1: Page Load Timeout

**Steps Used:**
```ts
await this.page.goto("https://demoqa.com/text-box", { timeout: 500 });
```

**Root Cause:**
`timeout: 500` (0.5 seconds) is too short for a full page load. Default is 30,000ms.

**Tools:** Playwright Trace Viewer → shows navigation never completed within timeout window.

**Fix:** Remove manual timeout or set to `30_000`.

---

### Timeout 2: Element Timeout

**Steps Used:**
```ts
await this.page.waitForSelector("#output", { timeout: 100 });
```

**Root Cause:**
The `#output` div only appears after form submission and DOM update (~300–800ms). 100ms is insufficient.

**Tools:** Playwright Trace Viewer → shows element wait expiry. Screenshots show blank output area.

**Fix:** Use `await expect(page.locator('#output')).toBeVisible()` — Playwright auto-waits up to the default timeout.

---

### Timeout 3: Step Timeout

**Steps Used:**
```ts
setDefaultTimeout(500); // set in hooks.ts
```
Then run any step that involves a network call.

**Root Cause:**
`setDefaultTimeout(500)` gives Cucumber only 0.5 seconds per step. Any step with a `page.goto()` or element interaction exceeds this.

**Tools:** Cucumber HTML Report → step shows "Timed out" status. Console shows `Timeout of 500ms exceeded`.

**Fix:** Set `setDefaultTimeout(30_000)` in `hooks.ts`.

---

## Tools Reference

| Tool | Purpose |
|---|---|
| Playwright Trace Viewer | `npx playwright show-trace reports/traces/<name>.zip` |
| Cucumber HTML Report | `reports/cucumber-report.html` — open in browser |
| Screenshots | `reports/screenshots/` — auto-saved on failure |
| Videos | `reports/videos/` — recorded per scenario |
| Console Logs | Terminal output during `npm test` |
