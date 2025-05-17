
export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  brand: string;
  productDescription: string;
  sizes: Size[];
  details: Record<string, string>;
  images: string[];
  url: string;
  lastScraped: string;
}

export interface Size {
  size: string;
  available: boolean;
  price?: number;
}

export interface ScrapingStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export interface SortConfig {
  key: keyof Product | '';
  direction: 'asc' | 'desc';
}
