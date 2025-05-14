
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrapingStatus } from '@/types/product';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  scrapingStatus: ScrapingStatus;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, scrapingStatus }) => {
  const [url, setUrl] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateUrl = (inputUrl: string): boolean => {
    // Basic validation to check if the URL is from StockX
    const regex = /^https?:\/\/(www\.)?stockx\.com\/.+$/i;
    return regex.test(inputUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error("Please enter a valid StockX URL");
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Scrape StockX Product</h2>
          <p className="text-muted-foreground">
            Enter a StockX product URL to fetch all available data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="url"
            placeholder="https://stockx.com/product-name"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`flex-1 bg-stockx-gray border-stockx-lightGray focus-visible:ring-stockx-green ${
              !isValid ? "border-red-500" : ""
            }`}
          />

          <Button 
            type="submit" 
            disabled={scrapingStatus.status === 'loading'}
            className="bg-stockx-green hover:bg-stockx-green/90 text-white"
          >
            {scrapingStatus.status === 'loading' ? (
              <>
                <span className="mr-2">Scraping</span>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </>
            ) : "Scrape Product"}
          </Button>
        </div>

        {!isValid && (
          <p className="text-sm text-red-500">Please enter a valid StockX URL</p>
        )}

        {scrapingStatus.status === 'loading' && (
          <div className="text-sm text-muted-foreground animate-pulse">
            {scrapingStatus.message || "Fetching product data..."}
          </div>
        )}

        {scrapingStatus.status === 'error' && (
          <div className="text-sm text-red-500">
            {scrapingStatus.message || "An error occurred while scraping. Please try again."}
          </div>
        )}
      </div>
    </form>
  );
};

export default UrlForm;
