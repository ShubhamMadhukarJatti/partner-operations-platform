import sys
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to getting-started...")
        page.goto('http://localhost:3005/getting-started')
        page.wait_for_load_state('networkidle')
        print("Current URL:", page.url)
        page.screenshot(path='/Users/prakhar/Developer/Sharkdom/sharkdom-Frontend/initial_load.png')
        browser.close()

if __name__ == '__main__':
    main()
