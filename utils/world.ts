import { World,IWorldOptions } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "playwright";
import { LoginPage } from "../pages/LoginPage";

// ---------------------------------------------------------------------------
// Shared World — all step definitions and hooks attach to this object.
// One instance is created per scenario by Cucumber.
// ---------------------------------------------------------------------------

export class CustomWorld  extends World{
  constructor(options: IWorldOptions){
    super(options);
  }
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // Page objects — initialised in hooks after page is ready
  loginPage!: LoginPage;
}

// Re-export so step files import from one place
export { chromium };
