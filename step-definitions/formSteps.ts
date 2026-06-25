import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../utils/world";

Given("user is on form page", async function (this: CustomWorld) {
  await this.formPage.navigate();
});

When(
  "user fills the form with following data:",
  async function (this: CustomWorld, dataTable: DataTable) {
    const rows = dataTable.rowsHash(); // { field: value, field: value }
    for (const [field, value] of Object.entries(rows))
    {
      await this.formPage.fillField(field, value);
    }
    await this.formPage.clickSubmit();
  }
);

When(
  "user fills the form with name {string} and email {string}",
  async function (this: CustomWorld, name: string, email: string) {
    await this.formPage.fillName(name);
    await this.formPage.fillEmail(email);
    await this.formPage.clickSubmit();
  }
);

Then(
  "form should be submitted successfully",
  async function (this: CustomWorld) {
    await this.formPage.assertFormSubmittedSuccessfully();
  }
);

Then(
  "form submission result should be {string}",
  async function (this: CustomWorld, expectedResult: string) {
    const actualResult = await this.formPage.getSubmissionResult();
    expect(actualResult).toBe(expectedResult);
  }
);
