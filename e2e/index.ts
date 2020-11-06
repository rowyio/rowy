import { chromium } from "playwright";
import { authenticateUser } from "./auth";
(async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  await authenticateUser(page);

  await page.goto("http://localhost:3000/table/test");
  // Click text="Add Column"
  await page.click(
    "//div[starts-with(normalize-space(.), 'EdwardKnightEd has had a multi decade career in European banking and capital mar') and normalize-space(@role)='row']/div[2][normalize-space(@role)='gridcell']/div/div/div/div[normalize-space(@role)='button']"
  );

  // Click //li[normalize-space(.)='LON3' and normalize-space(@role)='option']/*[local-name()="svg"]
  await page.click(
    "//li[normalize-space(.)='LON3' and normalize-space(@role)='option']/*[local-name()=\"svg\"]"
  );

  // Click //div[normalize-space(.)='Beijing' and normalize-space(@role)='button']
  await page.click(
    "//div[normalize-space(.)='Beijing' and normalize-space(@role)='button']"
  );

  // Click //li[normalize-space(.)='India' and normalize-space(@role)='option']/*[local-name()="svg"]
  await page.click(
    "//li[normalize-space(.)='India' and normalize-space(@role)='option']/*[local-name()=\"svg\"]"
  );

  // Click //li[normalize-space(.)='Oslo' and normalize-space(@role)='option']
  await page.click(
    "//li[normalize-space(.)='Oslo' and normalize-space(@role)='option']"
  );

  // Click text="Add Row"
  await page.click('text="Add Row"');

  // Click //button[normalize-space(.)='Hide']
  await page.click("//button[normalize-space(.)='Hide']");

  // Click li[role="option"] >> text="Department"
  await page.click('li[role="option"] >> text="Department"');

  // Click li[role="option"] >> text="Location"
  await page.click('li[role="option"] >> text="Location"');

  // Click li[role="option"] >> text="Designation"
  await page.click('li[role="option"] >> text="Designation"');

  // Click li[role="option"] >> text="Employment Type"
  await page.click('li[role="option"] >> text="Employment Type"');

  // Click text="Done"
  await page.click('text="Done"');

  // Click .MuiGrid-root.MuiGrid-item .MuiGrid-root .MuiButtonBase-root .MuiButton-label .MuiButton-startIcon .MuiSvgIcon-root path
  await page.click(
    ".MuiGrid-root.MuiGrid-item .MuiGrid-root .MuiButtonBase-root .MuiButton-label .MuiButton-startIcon .MuiSvgIcon-root path"
  );

  // Click //div[normalize-space(.)='Select Column']
  await page.click("//div[normalize-space(.)='Select Column']");

  // Click //li[normalize-space(.)='Last Name' and normalize-space(@role)='option']
  await page.click(
    "//li[normalize-space(.)='Last Name' and normalize-space(@role)='option']"
  );

  // Click div[role="presentation"] div[role="button"]
  await page.click('div[role="presentation"] div[role="button"]');

  // Click //li[normalize-space(.)='Employment Type' and normalize-space(@role)='option']
  await page.click(
    "//li[normalize-space(.)='Employment Type' and normalize-space(@role)='option']"
  );

  // Click //div[normalize-space(.)='Select Condition' and normalize-space(@role)='button']
  await page.click(
    "//div[normalize-space(.)='Select Condition' and normalize-space(@role)='button']"
  );

  // Click //li[normalize-space(.)='Equals' and normalize-space(@role)='option']
  await page.click(
    "//li[normalize-space(.)='Equals' and normalize-space(@role)='option']"
  );

  // Click //div[normalize-space(.)='Equals' and normalize-space(@role)='button']
  await page.click(
    "//div[normalize-space(.)='Equals' and normalize-space(@role)='button']"
  );

  // Click //div[normalize-space(.)='Select ConditionEqualsmatches any of' and normalize-space(@role)='presentation']/div[1]
  await page.click(
    "//div[normalize-space(.)='Select ConditionEqualsmatches any of' and normalize-space(@role)='presentation']/div[1]"
  );

  // Click //div[normalize-space(.)='​' and normalize-space(@role)='button']
  await page.click(
    "//div[normalize-space(.)='​' and normalize-space(@role)='button']"
  );

  // Click //li[normalize-space(.)='Part Time' and normalize-space(@role)='option']/*[local-name()="svg"]
  await page.click(
    "//li[normalize-space(.)='Part Time' and normalize-space(@role)='option']/*[local-name()=\"svg\"]"
  );

  // Click text="Apply"
  await page.click('text="Apply"');

  // Click //div[normalize-space(.)='employmentType == Part Time' and normalize-space(@role)='button']/*[local-name()="svg"]
  await page.click(
    "//div[normalize-space(.)='employmentType == Part Time' and normalize-space(@role)='button']/*[local-name()=\"svg\"]"
  );

  // ---------------------
  await context.close();
  await browser.close();
})();
