import { test, expect } from '@playwright/test';

test.describe('Library System End-to-End Flow', () => {

  test('Simulate complete user flow: Go to Admin -> Upload Book -> Verify on User Dashboard', async ({ page }) => {
    // 1. Navigate to the Admin Panel
    await page.goto('/admin');
    
    // Verify the page loaded correctly
    await expect(page.locator('h1.page-title')).toContainText('Dashboard Overview');

    // 2. Action: Fill out the Publisher Form
    const uniqueTitle = `Playwright Mastering ${Date.now()}`;
    await page.fill('input[placeholder="e.g. The Pragmatic Programmer"]', uniqueTitle);
    await page.fill('input[placeholder="e.g. Andy Hunt"]', 'E2E Validated Author');
    await page.fill('input[placeholder="e.g. Addison-Wesley"]', 'Playwright Inc.');
    await page.fill('input[placeholder="29.99"]', '19.99');
    
    // 3. Action: Upload a simulated PDF (using our local package.json as a mock entity)
    await page.setInputFiles('input[type="file"]', 'package.json');

    // 4. Commit Action: Submit the comprehensive backend pipeline
    await page.click('button[type="submit"]');

    // 5. Native Result: Verify it instantly populated in the Admin table database stream
    const table = page.locator('table.admin-table');
    await expect(table).toContainText(uniqueTitle);

    // 6. Navigate to the Global User Dashboard ("/" Route)
    await page.goto('/');

    // 7. Simulated Result: Verify the standard user perfectly sees the new catalog item populated!
    const newBookCard = page.locator('.book-card', { hasText: uniqueTitle });
    await expect(newBookCard).toBeVisible();
    await expect(newBookCard).toContainText('E2E Validated Author');
    await expect(newBookCard).toContainText('$19.99');
  });

});
