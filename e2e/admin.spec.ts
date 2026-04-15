import { test, expect } from '@playwright/test';

/**
 * Admin panel tests.
 * No backend is running; pages that load data from the API will show
 * their empty-state or loading fallback. Tests focus on:
 *   - Page loads and structure (header, nav)
 *   - Navigation between all 5 admin tabs
 *   - Heading text on each admin page
 *   - Empty state messages
 *   - Form presence (questions page)
 */

test.describe('Admin — Layout', () => {
  test('admin header shows TrustMate Admin branding', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('header')).toContainText('TrustMate Admin');
  });

  test('admin header has a link back to main app', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('header a', { hasText: 'กลับหน้าหลัก' })).toBeVisible();
  });

  test('clicking back-to-main navigates to /', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('header a', { hasText: 'กลับหน้าหลัก' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('admin nav renders all 5 tabs', async ({ page }) => {
    await page.goto('/admin');
    const nav = page.locator('nav');
    await expect(nav.locator('a')).toHaveCount(5);
  });

  test.describe('Admin nav tab labels', () => {
    const tabs = [
      { label: 'Dashboard', href: '/admin' },
      { label: 'โพสต์', href: '/admin/posts' },
      { label: 'Reports', href: '/admin/reports' },
      { label: 'ที่ปรึกษา', href: '/admin/therapists' },
      { label: 'คำถาม', href: '/admin/questions' },
    ];

    for (const tab of tabs) {
      test(`nav shows "${tab.label}" tab`, async ({ page }) => {
        await page.goto('/admin');
        await expect(page.locator('nav a', { hasText: tab.label })).toBeVisible();
      });
    }
  });
});

test.describe('Admin — Dashboard Page (/admin)', () => {
  test('dashboard shows loading state when API is unavailable', async ({ page }) => {
    await page.goto('/admin');
    // When the API is down the component renders "กำลังโหลด..." indefinitely
    await expect(page.locator('text=กำลังโหลด...')).toBeVisible();
  });
});

test.describe('Admin — Posts Page (/admin/posts)', () => {
  test('posts page loads with heading', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page.locator('h1')).toContainText('จัดการโพสต์');
  });

  test('posts page has filter buttons', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page.locator('button', { hasText: 'ทั้งหมด' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'clean' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'flagged' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'blocked' })).toBeVisible();
  });

  test('posts page shows empty state when no posts are available', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page.locator('text=ไม่มีโพสต์')).toBeVisible();
  });

  test('clicking flagged filter keeps the page stable', async ({ page }) => {
    await page.goto('/admin/posts');
    await page.locator('button', { hasText: 'flagged' }).click();
    // Heading should still be visible after filter click
    await expect(page.locator('h1')).toContainText('จัดการโพสต์');
  });
});

test.describe('Admin — Reports Page (/admin/reports)', () => {
  test('reports page loads with heading', async ({ page }) => {
    await page.goto('/admin/reports');
    await expect(page.locator('h1')).toContainText('Reports');
  });

  test('reports page shows empty state when no reports are available', async ({ page }) => {
    await page.goto('/admin/reports');
    await expect(page.locator('text=ไม่มี report ที่รอดู')).toBeVisible();
  });
});

test.describe('Admin — Therapists Page (/admin/therapists)', () => {
  test('therapists page loads with heading', async ({ page }) => {
    await page.goto('/admin/therapists');
    await expect(page.locator('h1')).toContainText('จัดการที่ปรึกษา');
  });

  test('therapists page has add button', async ({ page }) => {
    await page.goto('/admin/therapists');
    await expect(page.locator('button', { hasText: '+ เพิ่ม' })).toBeVisible();
  });

  test('therapists page shows empty state when no therapists are available', async ({ page }) => {
    await page.goto('/admin/therapists');
    await expect(page.locator('text=ยังไม่มีผู้ให้คำปรึกษา')).toBeVisible();
  });
});

test.describe('Admin — Questions Page (/admin/questions)', () => {
  test('questions page loads with heading', async ({ page }) => {
    await page.goto('/admin/questions');
    await expect(page.locator('h1')).toContainText('จัดการคำถาม');
  });

  test('questions page has assessment questions form section', async ({ page }) => {
    await page.goto('/admin/questions');
    await expect(page.locator('h2', { hasText: 'เพิ่มคำถามแบบประเมิน' })).toBeVisible();
  });

  test('questions page has today card form section', async ({ page }) => {
    await page.goto('/admin/questions');
    await expect(page.locator('h2', { hasText: 'เพิ่มคำถาม Today Card' })).toBeVisible();
  });

  test('assessment questions form has a text input and order input', async ({ page }) => {
    await page.goto('/admin/questions');
    // Two TmInput fields exist in the assessment section — text and order
    const inputs = page.locator('input');
    // At least 3 inputs: assessment text, assessment order, today question, today date
    await expect(inputs).toHaveCount(4);
  });

  test('add assessment question button is visible', async ({ page }) => {
    await page.goto('/admin/questions');
    await expect(page.locator('button', { hasText: 'เพิ่มคำถาม' }).first()).toBeVisible();
  });
});

test.describe('Admin — Tab Navigation', () => {
  test('clicking Posts tab navigates to /admin/posts', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('nav a', { hasText: 'โพสต์' }).click();
    await expect(page).toHaveURL(/\/admin\/posts/);
  });

  test('clicking Reports tab navigates to /admin/reports', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('nav a', { hasText: 'Reports' }).click();
    await expect(page).toHaveURL(/\/admin\/reports/);
  });

  test('clicking Therapists tab navigates to /admin/therapists', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('nav a', { hasText: 'ที่ปรึกษา' }).click();
    await expect(page).toHaveURL(/\/admin\/therapists/);
  });

  test('clicking Questions tab navigates to /admin/questions', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('nav a', { hasText: 'คำถาม' }).click();
    await expect(page).toHaveURL(/\/admin\/questions/);
  });

  test('clicking Dashboard tab navigates back to /admin', async ({ page }) => {
    await page.goto('/admin/posts');
    await page.locator('nav a', { hasText: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });
});
