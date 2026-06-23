import { World, IWorldOptions } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "playwright";
import { LoginPage } from "../pages/LoginPage";
import { FormPage } from "../pages/FormPage";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // Page objects — initialised in Before hook
  loginPage!: LoginPage;
  formPage!: FormPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

export { chromium };
