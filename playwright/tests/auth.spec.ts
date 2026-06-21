import { test, expect } from './fixtures';

const dummyPayload = {
  userId: 'user-123',
  profileId: 'profile-456',
  role: 'user',
};
const dummyJwt = `test-header.${Buffer.from(JSON.stringify(dummyPayload)).toString('base64')}.test-signature`;

test.describe('Authentication', () => {
  test('should allow a user to sign in', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: dummyJwt }),
      });
    });
    await page.route('**/auth/login/google', (route) =>
      route.fulfill({ status: 200, json: { url: 'https://google.com' } }),
    );

    await page.goto('/auth/signin');
    await expect(page.getByRole('heading', { name: 'Innogram' })).toBeVisible();

    await page.getByPlaceholder('Email address').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();

    await page.waitForURL('/app/feed');
    await expect(page).toHaveURL('/app/feed');
  });

  test('should allow a user to sign up', async ({ page }) => {
    await page.route('**/auth/signup', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: dummyJwt }),
      });
    });
    await page.route('**/auth/login/google', (route) =>
      route.fulfill({ status: 200, json: { url: 'https://google.com' } }),
    );

    await page.goto('/auth/signin');
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await page.waitForURL('/auth/signup');

    await expect(page.getByRole('heading', { name: 'Innogram' })).toBeVisible();

    await page.getByPlaceholder('Email address').fill('test@example.com');
    await page.getByPlaceholder('Username').fill('testuser');
    await page.getByPlaceholder('Birthdate').fill('2000-01-01');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    await page.waitForURL('/app/feed');
    await expect(page).toHaveURL('/app/feed');
  });
});