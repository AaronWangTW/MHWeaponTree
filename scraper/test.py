import asyncio
from playwright.sync_api import sync_playwright
#
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    info = {}
    page.goto("https://mhworld.kiranico.com/en/weapons/67I7ij/iron-assault-i",wait_until="domcontentloaded", timeout=60000)

    
    name_element = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[1]/div[1]/h5/div/div[2]')
    name = name_element.text_content()

    upgrades = []
    #upgrade_table_xpath = 'xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[4]/div[1]/div/table'
    upgrade_table = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[5]/div[1]/div/table')
    #upgrade_table = page.locator(upgrade_table_xpath)
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

    attack = affinity = element = rarity = None
    slots = [0,0,0,0]
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
        elif label_text == "rarity":
            rarity = value_text
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
        elif label_text == "slots":
            imgs = value_el.locator(">img").all()
            for img in imgs:
                img_name = img.get_attribute("src").split('/')[-1][:-4]
                slots[int(img_name[-1])-1] += 1

    costs = {
        "forge":[],
        "upgrade":[],
        "money":0
    }

    #melee_cost_table = 'xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[4]/div[2]/div[2]/table'
    gun_cost_table = '//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[5]/div[2]/div/table'

    cost_table = page.locator(gun_cost_table)
    cost_rows = cost_table.locator("tr").all()

    for [idx,key] in enumerate(cost_rows):
        if(idx == 0):
            costs['money'] = int(key.locator('td').all()[1].inner_text()[:-1].replace(',', ''))
        else:
            cells = key.locator('td').all()
            cost_type = cells[0].inner_text()
            cost_item = cells[1].inner_text()
            cost_amount = int(cells[2].inner_text()[1:].replace(',', ''))
            if "Forge" in cost_type:
                costs["forge"].append([cost_item,cost_amount])
            else:
                costs["upgrade"].append([cost_item,cost_amount])

    
    info[name] = {
        "attack": attack,
        "affinity": affinity,
        "element": element,
        "upgrades": upgrades,
        "sharpness" : sharpness,
        "rarity": rarity,
        "slots": slots,
        "costs":costs
    }
    print(info)

    browser.close()