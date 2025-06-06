import asyncio
from playwright.async_api import async_playwright

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
    await page.goto(url)
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

async def main():
    all_weapons_links = {}
    async with async_playwright() as p:
        tasks = [fetch_weapon_links(p, i) for i in weapon_mapping]
        results = await asyncio.gather(*tasks)

        for id, links in results:
            print(f"{id}: {len(links)} links")
            all_weapons_links[id] = links

asyncio.run(main())