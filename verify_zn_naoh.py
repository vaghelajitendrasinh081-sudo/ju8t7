import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 1000})
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(2000)
        await page.click('button:has-text("/practicals")')
        await page.wait_for_timeout(1000)
        await page.click('button:has-text("REACTION SIMULATOR ENGINE")')
        await page.wait_for_timeout(1000)

        # Select Reactant 1 and Reactant 2
        await page.select_option('select >> nth=1', value='Zn')
        await page.select_option('select >> nth=2', value='NaOH')

        await page.click('button:has-text("EXECUTE REACTION SIMULATION")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='/home/jules/verification/reaction_chamber_zn_naoh.png')
        await browser.close()

asyncio.run(run())
