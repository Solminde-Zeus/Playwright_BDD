//import all required files
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../utils/world";
// Background WOrk
Given("user is on login page", async function (this: CustomWorld) {
  await this.loginPage.navigate();
});


When("user enters valid username and password",async function (this: CustomWorld) 
{await this.loginPage.loginWithValidCredentials();});



When("user enters invalid credentials",async function (this: CustomWorld)
{await this.loginPage.loginWithInvalidCredentials();});



When("user enters {string} and {string}",async function (this: CustomWorld, username: string, password: string) 
{await this.loginPage.loginWith(username, password);});



When("clicks on login button", async function (this: CustomWorld) {});



When("user clicks logout", async function (this: CustomWorld)
{await this.loginPage.clickLogout()});



Then("user should be navigated to dashboard",async function (this: CustomWorld) 
{await this.loginPage.assertOnDashboard();});



Then("error message should be displayed",async function (this: CustomWorld) 
{await this.loginPage.assertErrorMessageVisible();});



Then("login result should be {string}",async function (this: CustomWorld, expectedResult: string) 
{const actualResult = await this.loginPage.getLoginResult();
  expect(actualResult).toBe(expectedResult);
});



Then("user should be redirected to login page", async function (this: CustomWorld) 
{await this.loginPage.assertOnLoginPage();});
