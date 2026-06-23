# BDD Playwright + Cucumber — Day 2

> QA Automation Training Part 3 · Day 2: Advanced BDD, DataTables, Hooks, Reports & Debugging

---

## Project Structure

```
bdd-day02/
├── features/
│   ├── login.feature          # TC_001–TC_004 + Scenario Outline (carried from Day 1)
│   └── form.feature           # TC_005–TC_007 + DataTable + Scenario Outline
├── step-definitions/
│   ├── loginSteps.ts          # Login step bindings
│   └── formSteps.ts           # Form step bindings (DataTable handling)
├── pages/
│   ├── LoginPage.ts           # Login Page Object
│   └── FormPage.ts            # Form Page Object
├── fixtures/
│   └── hooks.ts               # Before/After (browser, tracing, video, screenshots)
├── utils/
│   └── world.ts               # CustomWorld extends World
├── reports/                   # Auto-generated (gitignored)
│   ├── cucumber-report.html
│   ├── cucumber-report.json
│   ├── screenshots/
│   ├── traces/
│   └── videos/
├── DEBUGGING.md               # 8 failure cases + 3 timeout simulations
├── cucumber.json
├── tsconfig.json
└── package.json
```

---

## Installation

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all scenarios |
| `npm run test:login` | Login feature only |
| `npm run test:form` | Form feature only |
| `npm run test:report` | Run + generate HTML + JSON reports |
| `npm run test:tags -- --tags "@smoke"` | Run by tag |

---

## View Trace

```bash
npx playwright show-trace reports/traces/<scenario-name>.zip
```

---

## Test Coverage

| ID | Scenario | Feature | Type |
|---|---|---|---|
| TC_001 | Valid login | Login | Scenario |
| TC_002 | Invalid login | Login | Scenario |
| TC_003 | Empty credentials error | Login | Scenario |
| TC_004 | Logout | Login | Scenario |
| TC_OUT | Login with multiple creds | Login | Scenario Outline |
| TC_005 | Submit form — name + email | Form | DataTable |
| TC_006 | Submit form — name only | Form | DataTable |
| TC_007 | Submit form — all fields | Form | DataTable |
| TC_OUT2 | Form with parameterised data | Form | Scenario Outline |

---

## Applications Under Test

| App | URL |
|---|---|
| Login | https://the-internet.herokuapp.com/login |
| Form | https://demoqa.com/text-box |

---

## Architecture

```
Feature Files (.feature)
      │  Gherkin (Given/When/Then + DataTable)
      ▼
Step Definitions
      │  calls methods on Page Objects only
      ▼
Page Objects (LoginPage, FormPage)
      │  Playwright Page API
      ▼
Browser (Chromium)

Hooks (fixtures/hooks.ts)
  Before → launch browser, start tracing, record video, init page objects
  After  → stop trace, screenshot on failure, close browser
```

### Rules
- No hardcoded waits anywhere
- No logic or variables in step definitions — only method calls
- All selectors live only in Page Object classes
- `CustomWorld extends World` — required for `this.attach()`

---

## Reports Location

```
reports/
├── cucumber-report.html   ← open in browser
├── cucumber-report.json   ← machine-readable
├── screenshots/           ← auto on failure
├── traces/                ← view with playwright show-trace
└── videos/                ← mp4 per scenario
```

See `DEBUGGING.md` for 8 documented failure cases and 3 timeout simulations.
