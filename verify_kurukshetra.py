import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2000)

        # Click on AI Analytics tab
        await page.click('button:has-text("/ai-analytics")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/jules/verification/ai_analytics_kurukshetra.png')

        # Click on Launch Kurukshetra AI Suite button
        await page.click('button:has-text("LAUNCH KURUKSHETRA AI SUITE")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/jules/verification/kurukshetra_modal_opened.png')

        await browser.close()

asyncio.run(run())
