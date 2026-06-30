import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://books.toscrape.com/"

books = []

url = BASE_URL

while url:

    print("Scraping:", url)

    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        print("Failed to load page:", response.status_code)
        break

    soup = BeautifulSoup(response.text, "html.parser")

    products = soup.find_all("article", class_="product_pod")

    for product in products:

        title = product.h3.a["title"]

        price = product.find("p", class_="price_color").text

        price = price.replace("£", "").replace("Â", "")

        pounds = float(price)

        rupees = round(pounds * 110, 2)

        rating = product.find("p")["class"][1]

        availability = product.find(
            "p",
            class_="instock availability"
        ).text.strip()

        image = urljoin(BASE_URL, product.img["src"])

        books.append({
            "Title": title,
            "Price (₹)": rupees,
            "Rating": rating,
            "Availability": availability,
            "Image": image
        })

    next_button = soup.select_one("li.next a")

    if next_button:
        url = urljoin(url, next_button["href"])
    else:
        url = None


os.makedirs("data", exist_ok=True)

df = pd.DataFrame(books)

df.to_csv("data/books.csv", index=False)

print("\n" + "=" * 50)
print("BOOK PRICE TRACKER")
print("=" * 50)

print(df.head())

print()

print("Total Books:", len(df))

print("CSV saved successfully!")