import { test, expect } from '@playwright/test';

test.describe('HomePage Visual Tests', () => {
  test('should match the visual snapshot of HomePage', async ({ page }) => {
    // Navigate to the route where HomePage is rendered
    await page.goto('http://localhost:5173'); // Replace with the actual URL if different

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for the main image to load
    await page.waitForSelector('img[alt="homepage image"]');

    // Capture a screenshot of the full page
    const screenshot = await page.screenshot();

    // Compare the screenshot to the baseline
    await expect(screenshot).toMatchSnapshot('HomePage.png');
  });
});
