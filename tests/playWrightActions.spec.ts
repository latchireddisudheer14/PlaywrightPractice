import { test, expect } from '@playwright/test';

const webFormUrl = 'https://www.selenium.dev/selenium/web/web-form.html';

test('fill and clear text fields', async ({ page }) => {
  await page.goto(webFormUrl);

  const textInput = page.getByLabel('Text input');
  const textarea = page.getByLabel('Textarea');

  await textInput.fill('Playwright');
  await expect(textInput).toHaveValue('Playwright');

  // inputValue() reads the current value and stores it in a variable.
  const storedInputValue = await textInput.inputValue();
  expect(storedInputValue).toBe('Playwright');

  await textInput.clear();
  await expect(textInput).toHaveValue('');

  await textarea.fill('Learning Playwright actions');
  await expect(textarea).toHaveValue('Learning Playwright actions');
});

test('type text with keyboard events', async ({ page }) => {
  await page.goto(webFormUrl);

  const textInput = page.getByLabel('Text input');
  await textInput.pressSequentially('Keyboard input');
  await expect(textInput).toHaveValue('Keyboard input');
});

test('select an option from a dropdown', async ({ page }) => {
  await page.goto(webFormUrl);

  const dropdown = page.getByLabel('Dropdown (select)');
  await dropdown.selectOption({ label: 'Two' });
  await expect(dropdown).toHaveValue('2');
});

test('check and uncheck checkboxes', async ({ page }) => {
  await page.goto(webFormUrl);

  const checkedCheckbox = page.getByLabel('Checked checkbox');
  const defaultCheckbox = page.getByLabel('Default checkbox');

  const isTrue: boolean = await checkedCheckbox.isChecked();
  console.log(`Checked checkbox is checked: ${isTrue}`);
  await expect(isTrue).toBe(true);
  await expect(checkedCheckbox).toBeChecked();
  await checkedCheckbox.uncheck();
  await expect(checkedCheckbox).not.toBeChecked();

  await defaultCheckbox.check();
  await expect(defaultCheckbox).toBeChecked();
});

test('select a radio button', async ({ page }) => {
  await page.goto(webFormUrl);

  const radioButton = page.getByLabel('Default radio');
  await radioButton.check();
  await expect(radioButton).toBeChecked();
});

test('click the submit button', async ({ page }) => {
  await page.goto(webFormUrl);

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL(/submitted-form\.html/);
  await expect(page.getByText('Received!')).toBeVisible();
});
