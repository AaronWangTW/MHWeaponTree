import asyncio
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    info = {}
    page.goto("https://mhworld.kiranico.com/en/weapons/wetOiZ/high-chain-blitz-i",wait_until="domcontentloaded", timeout=60000)

    name_element = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[1]/div[1]/h5/div/div[2]')
    name = name_element.text_content()

    upgrades = []
    upgrade_table = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[5]/div[1]/div/table')
    rows = upgrade_table.locator("tbody tr").all()
    found_index = None
    # getting the index of the current weapon. All upgrades are below it
    for i, row in enumerate(rows):
        has_image = row.locator("img").count() > 0
        if not has_image:
            found_index = i
            break
    if found_index is None:
        raise ValueError("Could not identify current weapon row (no img-less row found)")
    
    for row in rows[found_index + 1:]:
        link_el = row.locator("td a span")
        if link_el.count() > 0:
            up_name = link_el.text_content()
            upgrades.append(up_name.strip())
    info[name] = {}
    info[name]['upgrades'] = upgrades
    print(info)

    browser.close()