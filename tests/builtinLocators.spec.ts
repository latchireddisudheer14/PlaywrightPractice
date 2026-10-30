import { test, expect } from '@playwright/test';

test('locate elements by role and accessible name', async ({ page }) => {
  await page.setContent(`
    <h1>Account settings</h1>
    <button>Save changes</button>
    <a href="/help">Help center</a>
  `);

  await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Help center' })).toHaveAttribute('href', '/help');
});

test('locate form controls by label and placeholder', async ({ page }) => {
  await page.setContent(`
    <label for="email">Email address</label>
    <input id="email" type="email" />
    <input type="search" placeholder="Search products" />
  `);

  await page.getByLabel('Email address').fill('user@example.com');
  await page.getByPlaceholder('Search products').fill('keyboard');

  await expect(page.getByLabel('Email address')).toHaveValue('user@example.com');
  await expect(page.getByPlaceholder('Search products')).toHaveValue('keyboard');
});

test('locate elements by text, alt text, title, and test id', async ({ page }) => {
  await page.setContent(`
    <p>Order confirmed</p>
    <img src="receipt.png" alt="Order receipt" />
    <button title="Close dialog">×</button>
    <div data-testid="order-number">Order #12345</div>
  `);

  await expect(page.getByText('Order confirmed')).toBeVisible();
  await expect(page.getByAltText('Order receipt')).toBeVisible();
  await expect(page.getByTitle('Close dialog')).toBeVisible();
  await expect(page.getByTestId('order-number')).toHaveText('Order #12345');
});
