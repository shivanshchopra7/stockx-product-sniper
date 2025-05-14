
import React from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface ExportButtonsProps {
  products: Product[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ products }) => {
  const exportData = (format: 'csv' | 'json') => {
    let data;
    let fileName;
    let fileType;

    if (format === 'json') {
      data = JSON.stringify(products, null, 2);
      fileName = 'stockx-products.json';
      fileType = 'application/json';
    } else {
      // Simple CSV implementation
      const headers = ['name', 'brand', 'currentPrice', 'url', 'lastScraped'];
      const csvData = [
        headers.join(','),
        ...products.map(product => 
          headers.map(header => {
            const value = product[header as keyof Product];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');
      
      data = csvData;
      fileName = 'stockx-products.csv';
      fileType = 'text/csv';
    }

    const blob = new Blob([data], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportData('csv')}
        className="border-stockx-lightGray"
      >
        Export CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportData('json')}
        className="border-stockx-lightGray"
      >
        Export JSON
      </Button>
    </div>
  );
};

export default ExportButtons;
