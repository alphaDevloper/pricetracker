import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;
  // curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_5b59494a-zone-pricetracker:wi5k2d9j4mso -k "https://geo.brdtest.com/welcome.txt?product=unlocker&method=native"
  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const session_id = (1000000 * Math.random()) | 0;
  // with options we can make request to get data with BrightData
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
  try {
    const response = await axios.get(url, options);
    // console.log(response.data);
    const $ = cheerio.load(response.data);
    // Extract the product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable"; // console.log boolean value due to this equation 'currently unavailable'
    const image =
      $("#imageBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}"; // attribte of data which is the url of image
    const imageURL = Object.keys(JSON.parse(image));
    const currencySymbol = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const description = extractDescription($);
    const data = {
      url,
      currency: currencySymbol || "$",
      image: imageURL[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
// image is assumed to be a JSON string.
// JSON.parse(image) converts this JSON string into a JavaScript object.
// Object.keys(...) takes an object as input and returns an array of its keys (property names).
// const imageURL = ...

// The result (an array of keys) is assigned to the imageURL variable.
// This code extracts all keys (property names) from a JSON object and stores them in an array.
// The JSON string must be properly formatted, or JSON.parse() will throw an error.
// 47. '{}' is used to completely parse image url in array
