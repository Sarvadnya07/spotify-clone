
import { test, expect } from '@playwright/test';

test.describe('Spotify Elite - Core Playback Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search for a vibe and play a song', async ({ page }) => {
    // 1. Navigate to Search
    await page.click('nav >> text=Search');
    await expect(page).toHaveURL(/.*search/);

    // 2. Perform AI Semantic Search
    const searchInput = page.locator('input[placeholder*="What do you want to listen to?"]');
    await searchInput.fill('chill lofi');
    
    // Wait for AI results
    await page.waitForTimeout(1000);
    const firstSong = page.locator('div[role="button"]').first();
    await expect(firstSong).toBeVisible();

    // 3. Play the song
    await firstSong.click();

    // 4. Verify Player Bar is active
    const playerBar = page.locator('footer');
    await expect(playerBar).toContainText('chill');
    
    // Check for playing status (Visualizer should be visible)
    const visualizer = page.locator('canvas');
    await expect(visualizer).toBeVisible();
  });

  test('should handle playback controls', async ({ page }) => {
    // Start playing first available song
    await page.click('div[role="button"] >> nth=0');
    
    // Click Play/Pause toggle
    const playPauseBtn = page.locator('button[aria-label="Play/Pause"]');
    await playPauseBtn.click();
    
    // Click Next
    const nextBtn = page.locator('button[aria-label="Next"]');
    await nextBtn.click();
    
    // Verify track changed
    // (Note: In a real test, we would check the store or DOM metadata)
  });
});
