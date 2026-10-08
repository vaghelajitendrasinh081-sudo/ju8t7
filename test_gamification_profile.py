import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 2400})

        # Navigate to preview server
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(2000)

        # Skip intro if present
        skip_btn = page.locator("text=ENTER CONSOLE DIRECTLY")
        if await skip_btn.is_visible():
            await skip_btn.click()
            await page.wait_for_timeout(1000)

        # Open Profile Modal
        profile_btn = page.locator("button:has-text('SETUP PROFILE')")
        if await profile_btn.is_visible():
            await profile_btn.click()
            await page.wait_for_timeout(500)
            await page.screenshot(path="/home/jules/verification/profile_modal.png")

            # Fill profile details
            await page.fill("input[placeholder*='Arjun']", "Vikram Rathore")
            await page.fill("input[placeholder*='JARVIS']", "KIRA")
            await page.fill("input[placeholder*='B.Tech']", "B.Tech Quantum Computing")
            await page.click("button:has-text('SAVE PROFILE MATRIX')")
            await page.wait_for_timeout(500)

        # Take main dashboard screenshot showing profile, level badge, and syllabus chapter progress
        await page.screenshot(path="/home/jules/verification/dashboard_gamified_profile.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
