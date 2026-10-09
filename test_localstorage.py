import asyncio
from playwright.async_api import async_playwright

async def test_ls():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        print("Navigating to app...")
        await page.goto("http://localhost:3000")

        # Wait for intro sequence
        await page.wait_for_timeout(3500)

        # Add custom category
        print("Adding custom category...")
        add_cat_btn = page.get_by_role("button", name="+ ADD CUSTOM CATEGORY")
        await add_cat_btn.click()

        input_cat = page.get_by_placeholder("e.g. Biology, History, Computer Science...")
        await input_cat.fill("Bio-Cybernetics")
        save_cat_btn = page.get_by_role("button", name="SAVE CATEGORY")
        await save_cat_btn.click()

        await page.wait_for_timeout(500)

        # Add new task
        print("Adding new task...")
        add_task_btn = page.get_by_role("button", name="NEW TASK")
        await add_task_btn.click()

        input_task = page.get_by_placeholder("e.g. Quantum Electrodynamics Derivations...")
        await input_task.fill("Verify LocalStorage Persistence Test Task")
        submit_task_btn = page.get_by_role("button", name="INITIALIZE TASK")
        await submit_task_btn.click()

        await page.wait_for_timeout(1000)

        # Reload page
        print("Reloading page...")
        await page.reload()

        # Wait for intro sequence on reload
        await page.wait_for_timeout(3500)

        # Check if "Bio-Cybernetics" category and task exist
        page_content = await page.content()

        has_cat = "Bio-Cybernetics" in page_content
        has_task = "Verify LocalStorage Persistence Test Task" in page_content

        print(f"Custom Category Persisted: {has_cat}")
        print(f"Task Persisted: {has_task}")

        await page.screenshot(path="/home/jules/verification/localstorage_persisted.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_ls())
