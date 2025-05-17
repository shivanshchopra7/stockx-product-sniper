const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Ensures IPv4 resolution comes first

const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;

  try {
    // Launch browser in non-headless mode for debugging
    browser = await chromium.launch({
      headless: false, // Change to true for production
      slowMo: 50, // Slows down steps to better visualize what's happening
    });

    const page = await browser.newPage();

    // Navigate to the product page
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle' });

    // Optional: Check for CAPTCHA or access denial
    const pageTitle = await page.title();
    if (
      pageTitle.toLowerCase().includes('access denied') ||
      pageTitle.toLowerCase().includes('are you human')
    ) {
      throw new Error('Blocked by StockX. CAPTCHA or access denied.');
    }

    // Extract product name
    const nameElement = await page.waitForSelector('h1[data-component="primary-product-title"]', { timeout: 20000 });
    const name = await nameElement.textContent();

    // Extract current price using multiple fallbacks
    const priceSelectors = [
      'h2[data-testid="trade-box-buy-amount"]', // Main Buy Now price
      'span[data-testid="trade-box-lowest-price"]', // Fallback 1
      'span[data-testid="trade-box-highest-price"]' // Fallback 2
    ];

    let currentPriceText = '';
    for (const selector of priceSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        currentPriceText = await page.textContent(selector);
        console.log('✅ Price found using selector:', selector, currentPriceText);
        break;
      } catch {
        console.log('⚠️ Price not found in selector:', selector);
      }
    }

    const currentPrice = parseFloat(currentPriceText.replace(/[^0-9.]/g, ''));

    // Extract image URL (lazy-loaded or not)
    const imageUrl = await page.getAttribute('img', 'data-src') || await page.getAttribute('img', 'src');
    console.log('🖼️ Image URL:', imageUrl);

    // Extract product detail fields (Style, Colorway, etc.)
    const details = {};
    const detailPairs = await page.$$('div:has(div:has-text("Style")) > div'); // Adjust if needed

    for (const container of detailPairs) {
      try {
        const key = await container.$eval('div:nth-child(1)', el => el.textContent?.trim());
        const value = await container.$eval('div:nth-child(2)', el => el.textContent?.trim());
        if (key && value) {
          details[key] = value;
        }
      } catch {
        // Ignore malformed rows
      }
    }
    let productDescription = '';
    try {
      const descHandle = await page.waitForSelector('[data-testid="product-description"] p', { timeout: 10000 });
      productDescription = await descHandle.evaluate(el => el.innerText.trim());
      console.log('📝 Product Description:', productDescription);
    } catch (err) {
      console.warn('⚠️ Product Description not found');
    }

    res.json({
      name,
      currentPrice,
      url,
      lastScraped: new Date().toISOString(),
      images: [imageUrl],
      productDescription,
    });
  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    res.status(500).json({ error: 'Failed to scrape product. Please try again later.' });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

