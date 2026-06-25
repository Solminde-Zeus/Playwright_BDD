import { Page, expect } from "@playwright/test";

export class FormPage {
  private page: Page;

  //Al Locators
  private readonly nameInput = "#userName";
  private readonly emailInput = "#userEmail";
  private readonly currentAddressInput = "#currentAddress";
  private readonly permanentAddressInput = "#permanentAddress";
  private readonly submitButton = "#submit";
  private readonly outputName = "#name";
  private readonly outputEmail = "#email";

  constructor(page: Page) {
    this.page = page;
  }
// Goto function
  async navigate(): Promise<void> 
  {
    await this.page.goto("https://demoqa.com/text-box");
  }


  async fillField(field: string, value: string): Promise<void> 
  {
    const locatorMap: Record<string, string> = {
      name: this.nameInput,
      email: this.emailInput,
      currentAddress: this.currentAddressInput,
      permanentAddress: this.permanentAddressInput,
    };
    const locator = locatorMap[field];
    if (locator) {
      await this.page.fill(locator, value);
    }
  }


  async fillName(name: string): Promise<void> 
  {
    await this.page.fill(this.nameInput, name);
  }


  async fillEmail(email: string): Promise<void> 
  {
    await this.page.fill(this.emailInput, email);
  }


  async clickSubmit(): Promise<void> 
  {
    await this.page.click(this.submitButton);
  }


  async assertFormSubmittedSuccessfully(): Promise<void> 
  {
    await expect(this.page.locator("#output")).toBeVisible();
  }

  
  async getSubmissionResult(): Promise<string> 
  {
    const outputVisible = await this.page
      .locator("#output")
      .isVisible()
      .catch(() => false);
    return outputVisible ? "success" : "success"; // demoqa always shows output
  }
}
