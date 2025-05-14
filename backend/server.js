const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60000, waitUntil: 'load' });

    // Extract product name
    const name = await page.textContent('h1');

    // Extract current price using fallback if the original selector fails
    const priceSelectors = [
      'h2[data-testid="trade-box-buy-amount"]', // Main price
      'span[data-testid="trade-box-lowest-price"]', // "Lowest Ask" or "Buy Now"
      'span[data-testid="trade-box-highest-price"]', // "Highest Offer" price
    ];

    let currentPriceText = '';
    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        currentPriceText = await page.textContent(selector);
        console.log('Price found in selector:', selector, currentPriceText);
        break;
      } catch {
        console.log('Price not found for selector:', selector);
      }
    }

    // Clean and parse the price
    const currentPrice = parseFloat(currentPriceText.replace(/[^0-9.]/g, '')); // Using parseFloat to handle decimals

    console.log('Parsed Current Price:', currentPrice);

    // Extract main image (handle lazy-loaded images if applicable)
    const imageUrl = await page.getAttribute('img', 'data-src') || await page.getAttribute('img', 'src');
    console.log('Image URL:', imageUrl);

    // Extract product details (like style, release date, etc.)
    const details = {};
    const infoLabels = await page.$$('div:has(div:has-text("Style")) > div'); // Double-check the selector

    for (const container of infoLabels) {
      try {
        const key = await container.$eval('div:nth-child(1)', el => el.textContent?.trim());
        const value = await container.$eval('div:nth-child(2)', el => el.textContent?.trim());
        if (key && value) {
          details[key] = value;
        }
      } catch {
        // Skip malformed entries
      }
    }

    await browser.close();

    res.json({
      name,
      currentPrice,
      url,
      lastScraped: new Date().toISOString(),
      images: [imageUrl], // Ensure you're getting the correct image URL
      details,
    });
  } catch (err) {
    console.error('Scraping failed:', err.message);
    res.status(500).json({ error: 'Failed to scrape product. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
