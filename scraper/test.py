import asyncio
from playwright.sync_api import sync_playwright
#
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    info = {}
    page.goto("https://mhworld.kiranico.com/en/weapons/lkHWibw/chrome-deathscythe-iii",wait_until="domcontentloaded", timeout=60000)

    
    name_element = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[1]/div[1]/h5/div/div[2]')
    name = name_element.text_content()

    upgrades = []
    upgrade_table_xpath = 'xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[4]/div[1]/div/table'
    #upgrade_table = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[5]/div[1]/div/table')
    upgrade_table = page.locator(upgrade_table_xpath)
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

    print(upgrades)

    attack = affinity = element = None
    stat_table = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[2]/div/div[2]/div/table')
    stat_cells = stat_table.locator("td").all()

    sharpness = {"base": {}, "max": {}}
    color_order = ["red", "orange", "yellow", "green", "blue", "white", "purple"]

    for cell in stat_cells:
        has_strong = cell.locator("strong").count() > 0
        has_div = cell.locator("div").count() > 0
        if not (has_strong and has_div):
            continue  # not a valid stat cell

        label_el = cell.locator(">div")
        label_text = (label_el.inner_text()).strip().lower()

        value_el = cell.locator("strong")
        value_text = (value_el.inner_text()).strip()

        print(label_text,value_text)

        if label_text == "attack":
            attack = value_text
        elif label_text == "affinity":
            affinity = value_text
        elif label_text == "element":
            element = value_text
        elif label_text == "sharpness":
            sharpness_bars = value_el.locator(">div").all()
            if len(sharpness_bars) < 2:
                print("sharpness not found")
                sharpness = None
                continue
            for idx, key in enumerate(["base", "max"]):
                bar_divs = sharpness_bars[idx].locator("div.d-flex > div").all()
                for div in bar_divs:
                    class_name = div.get_attribute("class")
                    style = div.get_attribute("style")
                    color = next((c for c in color_order if f"sharpness-{c}" in class_name), None)
                    if color and "width" in style:
                        width_px = float(style.split("width:")[1].replace("px;", "").strip())
                        sharpness[key][color] = width_px
    
    info[name] = {
        "attack": attack,
        "affinity": affinity,
        "element": element,
        "upgrades": upgrades,
        "sharpness" : sharpness
    }
    print(info)

    browser.close()