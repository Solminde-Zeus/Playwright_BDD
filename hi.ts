import { After, Before, setWorldConstructor, setDefaultTimeout, ITestCaseHookParameter } from "@cucumber/cucumber";

import { chromium } from "playwright";
import { CustomWorld } from "../bdd-day01/utils/world";
import { LoginPage } from "./pages/LoginPage";
import { FormPage } from "./pages/FormPage";
import * as fs from "fs";
import * as path from "path";


setWorldConstructor(CustomWorld);
setDefaultTimeout(30_000);

Before (async function (this:CustomWorld) {
    this.browser = await chromium.launch({headless: true} );

    this.context = await this.browser.newContext({
        viewport:{ width:1280, height:720},
        recordVideo: {dir: "reports/videos/"},

    });
    
    await this.context.tracing.start({screenshots : true, snapshots: true});

    this.page = await this.context.newPage();

    this.loginPage = new LoginPage(this.page);
    this.formPage = new FormPage(this.page);
     



     
})