import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Clear local storage before visiting to ensure fresh load
        page.goto("http://localhost:3000")
        page.evaluate("localStorage.clear()")
        page.reload()
        time.sleep(2)

        # Skip intro overlay if present
        skip_btn = page.query_selector("button:has-text('SKIP')")
        if skip_btn:
            skip_btn.click()
            time.sleep(1)

        # Take screenshot of fresh launch (empty state)
        page.screenshot(path="/home/jules/verification/empty_initial_state.png", full_page=True)
        print("Captured screenshot of empty initial state.")
        browser.close()

if __name__ == "__main__":
    run()
