import {
  Before, // Before teh test
  After, // After the test
  setWorldConstructor, // building a custom world
  setDefaultTimeout, // setting a default time
  ITestCaseHookParameter, //setting hoooks
} from "@cucumber/cucumber";
import { chromium } from "playwright";
import { CustomWorld } from "../utils/world";
import { LoginPage } from "../pages/LoginPage";
import { FormPage } from "../pages/FormPage";
import * as fs from "fs"; //file system
import * as path from "path"; // path


setWorldConstructor(CustomWorld);
setDefaultTimeout(30_000);

//Here is what happens before the code even starts
Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: false }); // headless means the no pop up of the browser 

  this.context = await this.browser.newContext({ // Record the screen
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: "reports/videos/" },
  });

  // Start Playwright trace
  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.page = await this.context.newPage();

  // Initialise page objects
  this.loginPage = new LoginPage(this.page);
  this.formPage = new FormPage(this.page);
});
// What happens after the files are been tested positive or negative doest mind
After(async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter
) {
  const safeName = scenario.pickle.name.replace(/[^a-z0-9]/gi, "_");

  // Always save trace
  const tracesDir = path.resolve("reports/traces");
  if (!fs.existsSync(tracesDir)) fs.mkdirSync(tracesDir, { recursive: true });
  await this.context.tracing.stop({
    path: path.join(tracesDir, `${safeName}.zip`),
  });

  // Screenshot on failure
  if (scenario.result?.status === "FAILED") { // If failed take a ss
    const screenshotsDir = path.resolve("reports/screenshots");
    if (!fs.existsSync(screenshotsDir))
      fs.mkdirSync(screenshotsDir, { recursive: true });

    const screenshot = await this.page.screenshot({
      path: path.join(screenshotsDir, `${safeName}.png`),
      fullPage: true,
    });
    await this.attach(screenshot, "image/png");

    console.error(`[FAILED] ${scenario.pickle.name}`);
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
