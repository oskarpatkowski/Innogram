# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should allow a user to sign up
- Location: playwright/tests/auth.spec.ts:23:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Email address')

```

# Page snapshot

```yaml
- generic [ref=e2]: "{\"message\":\"Cannot GET /auth/signup\",\"error\":\"Not Found\",\"statusCode\":404,\"timestamp\":\"2026-06-10T10:43:40.415Z\",\"path\":\"/auth/signup\"}"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication', () => {
  4  |   test('should allow a user to sign in', async ({ page }) => {
  5  |     await page.route('**/api/auth/login', async (route) => {
  6  |       await route.fulfill({
  7  |         status: 200,
  8  |         contentType: 'application/json',
  9  |         body: JSON.stringify({ accessToken: 'test-token' }),
  10 |       });
  11 |     });
  12 | 
  13 |     await page.goto('/auth/signin');
  14 | 
  15 |     await page.getByPlaceholder('Email address').fill('test@example.com');
  16 |     await page.getByPlaceholder('Password').fill('password123');
  17 |     await page.getByRole('button', { name: 'Log In' }).click();
  18 | 
  19 |     await page.waitForURL('/');
  20 |     await expect(page).toHaveURL('/');
  21 |   });
  22 | 
  23 |   test('should allow a user to sign up', async ({ page }) => {
  24 |     await page.route('**/api/auth/signup', async (route) => {
  25 |       await route.fulfill({
  26 |         status: 200,
  27 |         contentType: 'application/json',
  28 |         body: JSON.stringify({ accessToken: 'test-token' }),
  29 |       });
  30 |     });
  31 | 
  32 |     await page.goto('/auth/signup');
  33 | 
> 34 |     await page.getByPlaceholder('Email address').fill('test@example.com');
     |                                                  ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  35 |     await page.getByPlaceholder('Username').fill('testuser');
  36 |     await page.getByPlaceholder('Birthdate').fill('2000-01-01');
  37 |     await page.getByPlaceholder('Password').fill('password123');
  38 |     await page.getByRole('button', { name: 'Sign Up' }).click();
  39 | 
  40 |     await page.waitForURL('/');
  41 |     await expect(page).toHaveURL('/');
  42 |   });
  43 | });
  44 | 
```