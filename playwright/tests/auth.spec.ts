import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to sign in', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'test-token' }),
      });
    });

    await page.goto('/auth/signin');

    await page.getByPlaceholder('Email address').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should allow a user to sign up', async ({ page }) => {
    await page.route('**/api/auth/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'test-token' }),
      });
    });

    await page.goto('/auth/signup');

    await page.getByPlaceholder('Email address').fill('test@example.com');
    await page.getByPlaceholder('Username').fill('testuser');
    await page.getByPlaceholder('Birthdate').fill('2000-01-01');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
