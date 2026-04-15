import { test } from '@playwright/test';

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

const pages = [
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
  { name: 'forgot-password', path: '/forgot-password' },
  { name: 'splash', path: '/splash' },
  { name: 'home', path: '/' },
  { name: 'create-post', path: '/create-post' },
  { name: 'mood', path: '/mood' },
  { name: 'chat', path: '/chat' },
  { name: 'care', path: '/care' },
  { name: 'assessment', path: '/care/assessment' },
  { name: 'booking', path: '/care/booking' },
  { name: 'profile', path: '/profile' },
  { name: 'admin', path: '/admin' },
  { name: 'admin-posts', path: '/admin/posts' },
  { name: 'admin-reports', path: '/admin/reports' },
  { name: 'admin-therapists', path: '/admin/therapists' },
  { name: 'admin-questions', path: '/admin/questions' },
];

test.describe('Screenshots — Mobile (390px)', () => {
  test.use({ viewport: MOBILE });

  for (const p of pages) {
    test(`mobile: ${p.name}`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `../screenshots/mobile-${p.name}.png`,
        fullPage: true,
      });
    });
  }
});

test.describe('Screenshots — Desktop (1280px)', () => {
  test.use({ viewport: DESKTOP });

  for (const p of pages) {
    test(`desktop: ${p.name}`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `../screenshots/desktop-${p.name}.png`,
        fullPage: true,
      });
    });
  }
});
