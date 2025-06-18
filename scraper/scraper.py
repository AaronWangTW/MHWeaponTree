import asyncio
from playwright.async_api import async_playwright
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
import json
import os
from tqdm.asyncio import tqdm as atqdm  # for async contexts
from tqdm import tqdm

LINKS_FILE = "weapon_links.json"
INFO_FILE = "weapon_info.json"
FETCHED_LINKS_FILE = "fetched_links.json"

weapon_mapping = {
        0: "Great Sword",
        1: "Sword & Shield",
        2: "Dual Blades",
        3: "Long Sword",
        4: "Hammer",
        5: "Hunting Horn",
        6: "Lance",
        7: "Gunlance",
        8: "Switch Axe",
        9: "Charge Blade",
        10: "Insect Glaive",
        11: "Bow",
        12: "Heavy Bowgun",
        13: "Light Bowgun"
}

async def fetch_weapon_links(playwright, weapon_type_id):
    print(f"Getting weapon num {weapon_type_id}")
    browser = await playwright.chromium.launch()
    page = await browser.new_page()
    url = f"https://mhworld.kiranico.com/en/weapons?type={weapon_type_id}"
    await page.goto(url,wait_until="domcontentloaded", timeout=120000)
    await page.wait_for_selector("tr a")

    links = await page.locator("tr a").all()
    weapon_links = set()
    for link in links:
        href = await link.get_attribute("href")
        if href and "/weapons/" in href:
            weapon_links.add(href)

    await browser.close()
    print(f"Finished weapon num {weapon_type_id}")
    return weapon_type_id, sorted(weapon_links)

async def fetch_weapon_info(p, weapon_type_id, links, fetched_links, file_write_lock):
    print(f"Getting weapon num {weapon_type_id} info")
    browser = await p.chromium.launch()
    page = await browser.new_page()
    info = {}
    if weapon_type_id in [12, 13]:  # Bowguns
        upgrade_table_xpath = 'xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[5]/div[1]/div/table'
    else:
        upgrade_table_xpath = 'xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[4]/div[1]/div/table'
    for l in tqdm(links, desc=f"Weapon {weapon_type_id:02d}: {weapon_mapping[weapon_type_id]}", leave=False):
        if l in fetched_links[weapon_type_id]:
            print(f"Skipping cached weapon link: {l}")
            continue
        try:
            await page.goto(l, wait_until="domcontentloaded", timeout=60000)
        except PlaywrightTimeoutError:
            print(f"Timeout while loading {l}, skipping.")
            continue
        name_element = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[1]/div[1]/h5/div/div[2]')
        name = (await name_element.text_content()).strip()
        upgrades = []
        upgrade_table = page.locator(upgrade_table_xpath)
        rows = await upgrade_table.locator("tbody tr").all()
        found_index = None
        # getting the index of the current weapon. All upgrades are below it
        for i, row in enumerate(rows):
            has_image = await row.locator("img").count() > 0
            if not has_image:
                found_index = i
                break
        if found_index is None:
            raise ValueError("Could not identify current weapon row (no img-less row found)")
        
        for row in rows[found_index + 1:]:
            link_el = row.locator("td a span")
            if await link_el.count() > 0:
                up_name = await link_el.text_content()
                upgrades.append(up_name.strip())
        
        attack = affinity = element = None
        stat_table = page.locator('xpath=//*[@id="app"]/div/div/div[3]/div[3]/div[1]/div[2]/div/div[2]/div/div[2]/div/table')
        stat_cells = await stat_table.locator("td").all()

        sharpness = {"base": {}, "max": {}}
        color_order = ["red", "orange", "yellow", "green", "blue", "white", "purple"]

        for cell in stat_cells:
            has_strong = await cell.locator("strong").count() > 0
            has_div = await cell.locator("div").count() > 0
            if not (has_strong and has_div):
                continue  # not a valid stat cell

            label_el = cell.locator(">div")
            label_text = (await label_el.inner_text()).strip().lower()

            value_el = cell.locator("strong")
            value_text = (await value_el.inner_text()).strip()

            if label_text == "attack":
                attack = value_text
            elif label_text == "affinity":
                affinity = value_text
            elif label_text == "element":
                element = value_text
            elif label_text == "sharpness":
                sharpness_bars = await value_el.locator(">div").all()
                if len(sharpness_bars) < 2:
                    sharpness = None
                    continue
                for idx, key in enumerate(["base", "max"]):
                    bar_divs = await sharpness_bars[idx].locator("div.d-flex > div").all()
                    for div in bar_divs:
                        class_name = await div.get_attribute("class")
                        style = await div.get_attribute("style")
                        color = next((c for c in color_order if f"sharpness-{c}" in class_name), None)
                        if color and "width" in style:
                            width_px = float(style.split("width:")[1].replace("px;", "").strip())
                            sharpness[key][color] = width_px
        
        async with file_write_lock:
            if os.path.exists(INFO_FILE):
                with open(INFO_FILE, "r", encoding="utf-8") as f:
                    existing_info = json.load(f)
            else:
                existing_info = {}

            # Insert/update one weapon
            existing_info.setdefault(str(weapon_type_id), {})[name] = {
                "attack": attack,
                "affinity": affinity,
                "element": element,
                "upgrades": upgrades,
                "sharpness": sharpness
            }
            with open(INFO_FILE, "w", encoding="utf-8") as f:
                json.dump(existing_info, f, indent=2, ensure_ascii=False)

            # Save fetched link
            fetched_links[weapon_type_id].add(l)
            with open(FETCHED_LINKS_FILE, "w", encoding="utf-8") as f:
                json.dump({k: list(v) for k, v in fetched_links.items()}, f, indent=2)

    return weapon_type_id

async def main():
    all_weapons_links = {}
    file_write_lock = asyncio.Lock()
    if os.path.exists(FETCHED_LINKS_FILE):
        with open(FETCHED_LINKS_FILE, "r", encoding="utf-8") as f:
            raw_fetched_links = json.load(f)
        fetched_links = {int(k): set(v) for k, v in raw_fetched_links.items()}
    else:
        fetched_links = {k: set() for k in weapon_mapping.keys()}
    if os.path.exists(LINKS_FILE):
        print(f"Loading weapon links from {LINKS_FILE}")
        with open(LINKS_FILE, "r", encoding="utf-8") as f:
            raw_links = json.load(f)
        # convert keys from strings to ints
        all_weapons_links = {int(k): v for k, v in raw_links.items()}
    else:
        print("Links file not found, scraping weapon links...")
        async with async_playwright() as p:
            tasks = [fetch_weapon_links(p, i) for i in weapon_mapping]
            results = await asyncio.gather(*tasks)
            all_weapons_links = {id: links for id, links in results}
        with open(LINKS_FILE, "w", encoding="utf-8") as f:
            json.dump(all_weapons_links, f, indent=2)
            
    async with async_playwright() as p:
        tasks = [
            fetch_weapon_info(p, i, all_weapons_links[i], fetched_links, file_write_lock)
            for i in weapon_mapping
        ]
        await asyncio.gather(*tasks)

asyncio.run(main())