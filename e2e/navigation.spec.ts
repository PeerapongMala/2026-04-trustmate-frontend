import { test, expect } from '@playwright/test';

/**
 * Bottom nav tests use /care as the starting point because /care is a static
 * server component with no auth guard. Starting from / would redirect to /login
 * before the nav renders, making those tests flaky.
 */
test.describe('Navigation — Bottom Nav', () => {
  test('bottom nav is visible on /care', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('bottom nav has exactly 4 tab links', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav a')).toHaveCount(4);
  });

  test('chat nav link is present in bottom nav', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav a[href="/chat"]')).toBeVisible();
  });

  test('care nav link is present in bottom nav', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav a[href="/care"]')).toBeVisible();
  });

  test('profile nav link is present in bottom nav', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav a[href="/profile"]')).toBeVisible();
  });

  test('home nav link is present in bottom nav', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
  });

  test('home nav link navigates back to /', async ({ page }) => {
    await page.goto('/care');
    await page.locator('nav a[href="/"]').click();
    // / redirects to /login when unauthenticated — either URL is acceptable
    await page.waitForURL(/\/(login|$)/);
    const url = page.url();
    expect(url).toMatch(/\/(login|)$/);
  });

  test('care nav link navigates to /care', async ({ page }) => {
    await page.goto('/chat');
    await page.locator('nav a[href="/care"]').click();
    await expect(page).toHaveURL(/\/care$/);
  });
});

test.describe('Navigation — 404', () => {
  test('unknown route shows not-found page', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('h1')).toContainText('ไม่พบหน้าที่ต้องการ');
  });

  test('not-found page has a back-to-home button', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('text=กลับหน้าหลัก')).toBeVisible();
  });
});

test.describe('Navigation — Admin', () => {
  test('admin page loads with TrustMate Admin header', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=TrustMate Admin')).toBeVisible();
  });

  test('admin layout shows all 5 nav tabs', async ({ page }) => {
    await page.goto('/admin');
    const nav = page.locator('nav');
    await expect(nav.locator('a', { hasText: 'Dashboard' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'โพสต์' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Reports' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'ที่ปรึกษา' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'คำถาม' })).toBeVisible();
  });
});

test.describe('Responsive', () => {
  test('renders correctly at mobile width 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders correctly at desktop width 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('care page renders at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/care');
    await expect(page.locator('text=สายด่วนสุขภาพจิต')).toBeVisible();
  });
});
