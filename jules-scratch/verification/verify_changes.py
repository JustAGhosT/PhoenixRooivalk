from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the interactive demo page
            page.goto("http://localhost:3000/interactive-demo", timeout=60000)

            # 1. Handle the fullscreen prompt first
            fullscreen_button = page.get_by_role("button", name="Enter Fullscreen")
            expect(fullscreen_button).to_be_visible(timeout=30000)
            fullscreen_button.click()

            # 2. Handle the simulation warning overlay
            close_warning_button = page.get_by_role("button", name="✕")
            expect(close_warning_button).to_be_visible(timeout=10000)
            close_warning_button.click()

            # 3. Wait for the main UI to load and find the new research button
            research_button = page.get_by_role("button", name="Research")
            expect(research_button).to_be_visible(timeout=10000)

            # 4. Take a screenshot for visual verification
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Successfully took screenshot of the interactive demo page with the research button.")

        except Exception as e:
            print(f"An error occurred during the Playwright script: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    main()