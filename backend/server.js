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

  let browser;

  try {
    console.log('🔗 Scraping URL:', url);

    browser = await chromium.launch({
      headless: true,  // ✅ Use headless mode in production!
    });

    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle' });

    const pageTitle = await page.title();
    if (
      pageTitle.toLowerCase().includes('access denied') ||
      pageTitle.toLowerCase().includes('are you human')
    ) {
      throw new Error('Blocked by StockX. CAPTCHA or access denied.');
    }

    const nameElement = await page.waitForSelector('h1[data-component="primary-product-title"]', { timeout: 20000 });
    const name = await nameElement.textContent();

    const priceSelectors = [
      'h2[data-testid="trade-box-buy-amount"]',
      'span[data-testid="trade-box-lowest-price"]',
      'span[data-testid="trade-box-highest-price"]'
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

    const imageUrl = await page.getAttribute('img', 'data-src') || await page.getAttribute('img', 'src');
    console.log('🖼️ Image URL:', imageUrl);

    const details = {};
    const detailPairs = await page.$$('div:has(div:has-text("Style")) > div');

    for (const container of detailPairs) {
      try {
        const key = await container.$eval('div:nth-child(1)', el => el.textContent?.trim());
        const value = await container.$eval('div:nth-child(2)', el => el.textContent?.trim());
        if (key && value) details[key] = value;
      } catch { }
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
    res.status(500).json({ error: 'Scraping failed', details: err.message }); // ✅ Improved error info
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
