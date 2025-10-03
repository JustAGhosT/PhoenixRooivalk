from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Verify keyboard navigation for the dropdown
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.press('body', 'Tab')
    page.screenshot(path="jules-scratch/verification/dropdown_verification.png")

    # Verify the apostrophe fix in the contact section
    page.goto("http://localhost:3000/#contact")
    page.screenshot(path="jules-scratch/verification/contact_section_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)