import { test, expect } from './fixtures';

test('should navigate to the sign-in page and have the correct title', async ({ page }) => {
  await page.route('**/auth/login/google', (route) =>
    route.fulfill({ status: 200, json: { url: 'https://google.com' } }),
  );
  await page.goto('/auth/signin');
  await expect(page.getByRole('heading', { name: 'Innogram' })).toBeVisible();
  await expect(page).toHaveTitle(/Innogram/);
});