import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("Navigating to local dev server...")
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(5500)

        # Capture landing page hero view
        await page.screenshot(path="/home/jules/verification/landing_page_offline.png", full_page=False)
        print("Captured landing page hero section screenshot.")

        # Click Analytics tab
        await page.click("text=/ai-analytics/i")
        await page.wait_for_timeout(1000)

        # Scroll to Kurukshetra AI Console
        analytics_el = page.locator("#analytics-console")
        if await analytics_el.count() > 0:
            await analytics_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

        await page.screenshot(path="/home/jules/verification/offline_ai_console.png", full_page=False)
        print("Captured offline AI console screenshot.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
