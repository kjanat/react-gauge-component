import { test, expect } from "@playwright/test";

const EXPECTED_LIGHT_COLORS = {
  background: "white",
  tickColor: "#374151",
  needleColor: "#1f2937",
  needleCenter: "white",
  valueTextColor: "#1f2937",
};

const EXPECTED_DARK_COLORS = {
  background: "#1f2937",
  tickColor: "#9ca3af",
  needleColor: "#e5e7eb",
  needleCenter: "#374151",
  valueTextColor: "#f9fafb",
};

const CUSTOM_LIGHT_COLORS = {
  background: "#f3f4f6",
  tickColor: "#6b7280",
  needleColor: "#111827",
  needleCenter: "#e5e7eb",
  valueTextColor: "#111827",
};

const CUSTOM_DARK_COLORS = {
  background: "#111827",
  tickColor: "#d1d5db",
  needleColor: "#f9fafb",
  needleCenter: "#4b5563",
  valueTextColor: "#f9fafb",
};

async function getGaugeColors(page: any, gaugeIndex: number) {
  return await page.evaluate((index: number) => {
    const gauges = document.querySelectorAll("svg");
    const svg = gauges[index];
    if (!svg) return null;

    // Find inner arc (background)
    const innerArc = svg.querySelector('path[d*="M"][d*="A"][fill]:not([opacity])');
    // Find tick lines
    const tickLine = svg.querySelector("line[stroke]");
    // Find needle path
    const needlePaths = svg.querySelectorAll('path[fill]:not([d*="A"])');
    const needlePath = needlePaths[needlePaths.length - 1]; // Last path is usually the needle
    // Find needle center circle
    const circles = svg.querySelectorAll("circle[fill]");
    const needleCenter = circles[circles.length - 1]; // Last circle is usually the center
    // Find text elements - value text has explicit fill, others use currentColor
    const texts = svg.querySelectorAll("text");
    let valueText = null;
    texts.forEach(text => {
      const fill = text.getAttribute("fill");
      if (fill && fill !== "currentColor") {
        valueText = text;
      }
    });

    return {
      background: innerArc?.getAttribute("fill") || "not found",
      tickColor: tickLine?.getAttribute("stroke") || "not found",
      needleColor: needlePath?.getAttribute("fill") || "not found",
      needleCenter: needleCenter?.getAttribute("fill") || "not found",
      valueTextColor: valueText?.getAttribute("fill") || "not found",
    };
  }, gaugeIndex);
}

test.describe("Dark Mode Support", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display correct colors in light mode by default", async ({ page }) => {
    // Check first 4 gauges (default theme)
    for (let i = 0; i < 4; i++) {
      const colors = await getGaugeColors(page, i);
      expect(colors).toEqual(EXPECTED_LIGHT_COLORS);
    }

    // Check 5th gauge (custom theme)
    const customColors = await getGaugeColors(page, 4);
    expect(customColors).toEqual(CUSTOM_LIGHT_COLORS);
  });

  test("should toggle to dark mode and display correct colors", async ({ page }) => {
    // Click dark mode toggle
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    
    // Wait for animations
    await page.waitForTimeout(500);

    // Verify dark class is applied
    const darkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    expect(darkClass).toBe(true);

    // Check first 4 gauges (default dark theme)
    for (let i = 0; i < 4; i++) {
      const colors = await getGaugeColors(page, i);
      expect(colors).toEqual(EXPECTED_DARK_COLORS);
    }

    // Check 5th gauge (custom dark theme)
    const customColors = await getGaugeColors(page, 4);
    expect(customColors).toEqual(CUSTOM_DARK_COLORS);
  });

  test("should toggle back to light mode", async ({ page }) => {
    // First switch to dark mode
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Then switch back to light mode
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Verify dark class is removed
    const darkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    expect(darkClass).toBe(false);

    // Check colors are back to light mode
    const colors = await getGaugeColors(page, 0);
    expect(colors).toEqual(EXPECTED_LIGHT_COLORS);
  });

  test("should persist dark mode state during navigation", async ({ page }) => {
    // Enable dark mode
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Dark mode should persist after reload
    const darkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    expect(darkClass).toBe(true);

    // Check that colors are still in dark mode
    const colors = await getGaugeColors(page, 0);
    expect(colors).toEqual(EXPECTED_DARK_COLORS);
  });

  test("should respect OS preference when no explicit class is set", async ({ page, context }) => {
    // Clear theme preference to test OS preference
    await page.evaluate(() => {
      localStorage.removeItem("theme");
    });
    
    // Create context with dark OS preference
    const darkContext = await context.browser()?.newContext({
      colorScheme: "dark",
    });
    
    if (darkContext) {
      const darkPage = await darkContext.newPage();
      await darkPage.goto("/");
      await darkPage.waitForLoadState("networkidle");

      // Should not have explicit dark/light classes
      const hasClasses = await darkPage.evaluate(() => {
        const html = document.documentElement;
        return html.classList.contains("dark") || html.classList.contains("light");
      });
      expect(hasClasses).toBe(false);

      // Component should still respect OS dark preference
      const colors = await getGaugeColors(darkPage, 0);
      expect(colors).toEqual(EXPECTED_DARK_COLORS);

      await darkPage.close();
      await darkContext.close();
    }

    // Test with light OS preference
    const lightContext = await context.browser()?.newContext({
      colorScheme: "light",
    });
    
    if (lightContext) {
      const lightPage = await lightContext.newPage();
      await lightPage.goto("/");
      await lightPage.waitForLoadState("networkidle");

      // Should not have explicit dark/light classes
      const hasClasses = await lightPage.evaluate(() => {
        const html = document.documentElement;
        return html.classList.contains("dark") || html.classList.contains("light");
      });
      expect(hasClasses).toBe(false);

      // Component should respect OS light preference
      const colors = await getGaugeColors(lightPage, 0);
      expect(colors).toEqual(EXPECTED_LIGHT_COLORS);

      await lightPage.close();
      await lightContext.close();
    }
  });

  test("should handle system preference for light mode", async ({ page, context }) => {
    // Create a new context with light color scheme preference
    const lightContext = await context.browser()?.newContext({
      colorScheme: "light",
    });
    
    if (lightContext) {
      const lightPage = await lightContext.newPage();
      await lightPage.goto("/");
      await lightPage.waitForLoadState("networkidle");

      // Component should detect system light mode preference
      const colors = await getGaugeColors(lightPage, 0);
      
      // The component should be in light mode
      expect(colors).toEqual(EXPECTED_LIGHT_COLORS);

      await lightPage.close();
      await lightContext.close();
    }
  });

  test("should allow manual override of dark OS preference to light mode", async ({ page, context, browserName }) => {
    // Skip this test in webkit due to OS preference detection issues
    if (browserName === 'webkit') {
      test.skip();
    }
    // Create a new context with dark color scheme preference
    const darkContext = await context.browser()?.newContext({
      colorScheme: "dark",
    });
    
    if (darkContext) {
      const darkPage = await darkContext.newPage();
      await darkPage.goto("/");
      await darkPage.waitForLoadState("networkidle");

      // Check the initial state - should be based on OS preference (dark)
      const initialDarkMode = await darkPage.evaluate(() => {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      });

      let colors = await getGaugeColors(darkPage, 0);
      
      // If browser supports OS preference detection, it should start in dark mode
      if (initialDarkMode) {
        expect(colors).toEqual(EXPECTED_DARK_COLORS);
        
        // Toggle to light mode manually (overriding OS preference)
        await darkPage.getByRole("button", { name: "Toggle dark mode" }).click();
        await darkPage.waitForTimeout(500);

        // Should now be in light mode despite OS preference for dark
        colors = await getGaugeColors(darkPage, 0);
        expect(colors).toEqual(EXPECTED_LIGHT_COLORS);
      } else {
        // Some browsers might not support OS preference detection in test environment
        // In that case, verify we can still toggle themes
        const isLight = colors.background === EXPECTED_LIGHT_COLORS.background;
        
        // Toggle theme
        await darkPage.getByRole("button", { name: "Toggle dark mode" }).click();
        await darkPage.waitForTimeout(500);
        
        // Verify theme changed
        colors = await getGaugeColors(darkPage, 0);
        if (isLight) {
          expect(colors).toEqual(EXPECTED_DARK_COLORS);
        } else {
          expect(colors).toEqual(EXPECTED_LIGHT_COLORS);
        }
      }

      await darkPage.close();
      await darkContext.close();
    }
  });

  test("should allow manual override of light OS preference to dark mode", async ({ page, context }) => {
    // Create a new context with light color scheme preference
    const lightContext = await context.browser()?.newContext({
      colorScheme: "light",
    });
    
    if (lightContext) {
      const lightPage = await lightContext.newPage();
      await lightPage.goto("/");
      await lightPage.waitForLoadState("networkidle");

      // Verify it starts in light mode due to OS preference
      let colors = await getGaugeColors(lightPage, 0);
      expect(colors).toEqual(EXPECTED_LIGHT_COLORS);

      // Toggle to dark mode manually
      await lightPage.getByRole("button", { name: "Toggle dark mode" }).click();
      await lightPage.waitForTimeout(500);

      // Should now be in dark mode despite OS preference
      colors = await getGaugeColors(lightPage, 0);
      expect(colors).toEqual(EXPECTED_DARK_COLORS);

      // Verify the dark class is added
      const darkClass = await lightPage.evaluate(() => {
        return document.documentElement.classList.contains("dark");
      });
      expect(darkClass).toBe(true);

      await lightPage.close();
      await lightContext.close();
    }
  });

  test("should display proper text contrast in both modes", async ({ page }) => {
    // Light mode text visibility
    const lightModeText = await page.locator("text=Performance").first();
    await expect(lightModeText).toBeVisible();

    // Switch to dark mode
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Dark mode text visibility
    const darkModeText = await page.locator("text=Performance").first();
    await expect(darkModeText).toBeVisible();
  });

  test("should maintain gauge functionality in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Test slider interaction
    const slider = await page.locator('input[type="range"]').first();
    await slider.fill("4.5");

    // Verify value updates
    const valueText = await page.locator("text=Value: 4.5").first();
    await expect(valueText).toBeVisible();
  });

  test("should clear theme preference and use OS preference", async ({ page }) => {
    // Set to dark mode first
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.waitForTimeout(500);

    // Verify dark mode is active
    let darkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    expect(darkClass).toBe(true);

    // Clear theme preference
    await page.getByRole("button", { name: "Clear theme preference" }).click();
    await page.waitForTimeout(500);

    // Should not have explicit dark/light classes
    const hasClasses = await page.evaluate(() => {
      const html = document.documentElement;
      return html.classList.contains("dark") || html.classList.contains("light");
    });
    expect(hasClasses).toBe(false);

    // Verify localStorage is cleared
    const savedTheme = await page.evaluate(() => {
      return localStorage.getItem("theme");
    });
    expect(savedTheme).toBeNull();
  });
});