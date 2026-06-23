import { Before,After,AfterStep,setWorldConstructor,setDefaultTimeout,ITestCaseHookParameter,} from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "../utils/world";
import { LoginPage } from "../pages/LoginPage";
import * as fs from "fs";
import * as path from "path";

setWorldConstructor(CustomWorld);


setDefaultTimeout(30_000);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  this.page = await this.context.newPage();

  // Initialise page objects
  this.loginPage = new LoginPage(this.page);
});

// ---------------------------------------------------------------------------
// After — capture screenshot on failure, then close browser
// ---------------------------------------------------------------------------
After(async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter
) {
  if (scenario.result?.status === "FAILED") {
    const screenshotsDir = path.resolve("reports/screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const safeName = scenario.pickle.name.replace(/[^a-z0-9]/gi, "_");
    const screenshotPath = path.join(screenshotsDir, `${safeName}.png`);

    const screenshot = await this.page.screenshot({ path: screenshotPath });
    // Attach to Cucumber report
    await (this as any).attach(screenshot, "image/png");

    console.error(
      `[FAILED] Screenshot saved: ${screenshotPath}`
    );
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
