import { test, expect } from '@playwright/test';

test.describe('Care — Main Page', () => {
  test('care page loads with helpline section', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('text=สายด่วนสุขภาพจิต')).toBeVisible();
    await expect(page.locator('text=1323')).toBeVisible();
  });

  test('helpline 1323 is a tel: anchor', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('a[href="tel:1323"]')).toBeVisible();
  });

  test('care page shows assessment card', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('text=แบบประเมินความเครียด')).toBeVisible();
  });

  test('care page shows booking card', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('text=Book a Session')).toBeVisible();
  });

  test('assessment card navigates to /care/assessment', async ({ page }) => {
    await page.goto('/care');
    await page.locator('a[href="/care/assessment"]').click();
    await expect(page).toHaveURL(/\/care\/assessment/);
  });

  test('booking card navigates to /care/booking', async ({ page }) => {
    await page.goto('/care');
    await page.locator('a[href="/care/booking"]').click();
    await expect(page).toHaveURL(/\/care\/booking/);
  });

  test('care page shows motivational message', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('text=แค่ได้พูดคุยกับใครสักคนก็ช่วยให้ใจเบาลงได้มาก')).toBeVisible();
  });
});

test.describe('Care — Assessment Page', () => {
  test('assessment page shows type selection heading', async ({ page }) => {
    await page.goto('/care/assessment');
    await expect(page.locator('h1')).toContainText('เลือกแบบประเมิน');
  });

  test('assessment page shows stress assessment option (PSS-10)', async ({ page }) => {
    await page.goto('/care/assessment');
    await expect(page.locator('text=แบบประเมินความเครียด')).toBeVisible();
    await expect(page.locator('text=PSS-10')).toBeVisible();
  });

  test('assessment page shows depression assessment option (PHQ-9)', async ({ page }) => {
    await page.goto('/care/assessment');
    await expect(page.locator('text=แบบประเมินภาวะซึมเศร้า')).toBeVisible();
    await expect(page.locator('text=PHQ-9')).toBeVisible();
  });

  test('clicking stress assessment shows intro screen', async ({ page }) => {
    await page.goto('/care/assessment');
    await page.locator('text=PSS-10').click();
    await expect(page.locator('text=ช่วงนี้คุณมีเรื่องที่กังวลใจอยู่ไหม')).toBeVisible();
  });

  test('clicking depression assessment shows intro screen', async ({ page }) => {
    await page.goto('/care/assessment');
    await page.locator('text=PHQ-9').click();
    await expect(page.locator('text=เห็นช่วงนี้คุณดูเหนื่อย')).toBeVisible();
  });

  test('intro screen has a next button', async ({ page }) => {
    await page.goto('/care/assessment');
    await page.locator('text=PSS-10').click();
    await expect(page.locator('button', { hasText: 'ถัดไป' })).toBeVisible();
  });
});
