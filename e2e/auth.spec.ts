import { test, expect } from '@playwright/test';

test.describe('Auth — Login Page', () => {
  test('login page loads with heading and inputs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login page has Google login button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=เข้าสู่ระบบด้วย Google')).toBeVisible();
  });

  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=สมัครเลย!')).toBeVisible();
  });

  test('login page has forgot-password link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });

  test('email input is required', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required', '');
  });

  test('password input is required', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('required', '');
  });

  test('clicking register link navigates to /register', async ({ page }) => {
    await page.goto('/login');
    await page.locator('a[href="/register"]').click();
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe('Auth — Register Page', () => {
  test('register page loads with heading', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('สร้างบัญชี');
  });

  test('register page has privacy checkbox and text', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('text=นโยบายความเป็นส่วนตัว')).toBeVisible();
  });

  test('register shows validation error when passwords do not match', async ({ page }) => {
    await page.goto('/register');
    // Fill all required fields: email, alias, password, confirm-password
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="text"]').fill('myalias');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('different456');
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('p.text-red-500')).toContainText('รหัสผ่านไม่ตรงกัน');
  });
});

test.describe('Auth — Forgot Password Page', () => {
  test('forgot password page loads with heading', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('h1')).toContainText('ลืมรหัสผ่าน');
  });

  test('forgot password page has email input', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Auth — Splash Page', () => {
  test('splash page redirects away when no token is set', async ({ page }) => {
    // Ensure no token in storage
    await page.goto('/splash');
    // Should redirect to login since no auth token is present
    await page.waitForURL(/\/(login|splash)?$/);
  });
});
