import React, { useState } from 'react';
import Header from '@/components/Header';
import UrlForm from '@/components/UrlForm';
import ResultsTable from '@/components/ResultsTable';
import EmptyState from '@/components/EmptyState';
import { Product, ScrapingStatus } from '@/types/product';
import { toast } from 'sonner';

// Sample data to demonstrate UI until backend is connected
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Dunk Low Retro White Black Panda (2021)',
    currentPrice: 129,
    brand: 'Nike',
    productDescription: 'The Nike Dunk Low Retro White Black brings back a classic basketball shoe for casual wear.',
    sizes: [
      { size: 'US 8', available: true, price: 120 },
      { size: 'US 9', available: true, price: 125 },
      { size: 'US 10', available: true, price: 129 },
      { size: 'US 11', available: false },
      { size: 'US 12', available: true, price: 135 },
    ],
    details: {
      'Style': 'DD1391-100',
      'Colorway': 'White/Black',
      'Release Date': '2021-01-14',
      'Material': 'Leather',
    },
    images: [
      'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color',
    ],
    url: 'https://stockx.com/nike-dunk-low-retro-white-black-2021',
    lastScraped: '2024-05-14T12:00:00Z',
  },
  {
    id: '2',
    name: 'Air Jordan 1 Retro High OG Chicago (2022)',
    currentPrice: 355,
    brand: 'Jordan',
    productDescription: 'The Air Jordan 1 Retro High OG Chicago returns in its original form with premium leather and iconic colorway.',
    sizes: [
      { size: 'US 7', available: false },
      { size: 'US 8', available: true, price: 345 },
      { size: 'US 9', available: true, price: 355 },
      { size: 'US 10', available: true, price: 370 },
      { size: 'US 11', available: true, price: 380 },
      { size: 'US 12', available: false },
    ],
    details: {
      'Style': 'DZ5485-612',
      'Colorway': 'Varsity Red/Black-White',
      'Release Date': '2022-11-19',
      'Material': 'Leather',
    },
    images: [
      'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color',
    ],
    url: 'https://stockx.com/air-jordan-1-retro-high-og-chicago-2022',
    lastScraped: '2024-05-13T09:30:00Z',
  },
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrapingStatus, setScrapingStatus] = useState<ScrapingStatus>({ status: 'idle' });
  const [demoMode, setDemoMode] = useState<boolean>(true);

const handleUrlSubmit = async (url: string) => {
  setScrapingStatus({ status: 'loading', message: 'Scraping product data...' });

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ''); // safely remove trailing slash
    const fullUrl = `${baseUrl}/api/scrape`;
    console.log('Sending POST to:', fullUrl); // optional debug log

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const product = await response.json();
    console.log('Scraped Product Data:', product);

    setProducts([product]); // For a single product
    setScrapingStatus({ status: 'success' });
    toast.success('Scraped product data successfully!');
  } catch (error) {
    setScrapingStatus({ status: 'error', message: 'Scraping failed' });
    toast.error('Failed to scrape product data.');
  }
};



  const showSampleData = () => {
    setProducts(sampleProducts);
    toast.info('Loaded sample product data for preview');
  };

  return (
    <div className="min-h-screen bg-stockx-dark text-white flex flex-col">
      <Header />

      <main className="container mx-auto py-8 px-4 flex-1 space-y-8">
        <UrlForm onSubmit={handleUrlSubmit} scrapingStatus={scrapingStatus} />

        <div className="space-y-6">
          {products.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Scraped Products ({products.length})
                </h2>
                {/* {demoMode && (
                  <div className="text-xs text-muted-foreground bg-stockx-gray px-2 py-1 rounded">
                    DEMO MODE - Sample Data
                  </div>
                )} */}
              </div>
              <ResultsTable products={products} />
            </>
          ) : (
            <EmptyState action={showSampleData} actionLabel="View Sample Data" />
          )}
        </div>
      </main>

      <footer className="border-t border-stockx-lightGray py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>StockX Scraper - Product Data Extraction Tool &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">This tool is for educational purposes only. Not affiliated with StockX.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
