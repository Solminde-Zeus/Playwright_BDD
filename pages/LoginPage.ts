import { Page, expect } from "@playwright/test";

export class LoginPage {
  private page: Page;

  private readonly usernameInput = "#username";
  private readonly passwordInput = "#password";
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = "#flash";
  private readonly logoutButton = ".button.secondary.radius";


  constructor(page: Page) {
    this.page = page;
  }


  async navigate(): Promise<void> {
    await this.page.goto("https://the-internet.herokuapp.com/login");
  }

  async loginWith(username: string, password: string): Promise<void> 
  {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }


  async loginWithValidCredentials(): Promise<void> 
  {
    await this.loginWith("tomsmith", "SuperSecretPassword!");
  }


  async loginWithInvalidCredentials(): Promise<void> 
  {
    await this.loginWith("wronguser", "wrongpassword");
  }


  async clickLogout(): Promise<void> 
  {
    await this.page.click(this.logoutButton);
  }


  async assertOnDashboard(): Promise<void> 
  {
    await expect(this.page).toHaveURL(
      "https://the-internet.herokuapp.com/secure"
    );
    await expect(this.page.locator("h2")).toContainText("Secure Area");
  }


  async assertErrorMessageVisible(): Promise<void> 
  {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
  }


  async assertOnLoginPage(): Promise<void> 
  {
    await expect(this.page).toHaveURL(
      "https://the-internet.herokuapp.com/login"
    );
  }

  async getLoginResult(): Promise<string> 
  {
    const currentUrl = this.page.url();
    if (currentUrl.includes("/secure")) return "success";
    const errorVisible = await this.page
      .locator(this.errorMessage)
      .isVisible()
      .catch(() => false);
    return errorVisible ? "failure" : "failure";
  }
}
