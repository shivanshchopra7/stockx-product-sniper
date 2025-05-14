
import React, { useState } from 'react';
import { Product, SortConfig } from '@/types/product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

interface ResultsTableProps {
  products: Product[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

  const handleSort = (key: keyof Product) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

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
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant={viewMode === 'card' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('card')}
            className={viewMode === 'card' ? "bg-stockx-green hover:bg-stockx-green/90" : ""}
          >
            Cards
          </Button>
          <Button 
            variant={viewMode === 'table' ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? "bg-stockx-green hover:bg-stockx-green/90" : ""}
          >
            Table
          </Button>
        </div>
        
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-stockx-gray border-stockx-lightGray"
          />
        </div>
        
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
      </div>

      <div className="bg-stockx-dark rounded-lg border border-stockx-lightGray overflow-hidden">
        {sortedProducts.length > 0 ? (
          viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-stockx-gray/50 bg-stockx-gray border-b border-stockx-lightGray">
                    <TableHead 
                      onClick={() => handleSort('name')} 
                      className="cursor-pointer"
                    >
                      Product Name
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSort('brand')} 
                      className="cursor-pointer"
                    >
                      Brand
                    </TableHead>
                    <TableHead 
                      onClick={() => handleSort('currentPrice')} 
                      className="cursor-pointer text-right"
                    >
                      Price
                    </TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead 
                      onClick={() => handleSort('lastScraped')} 
                      className="cursor-pointer"
                    >
                      Last Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.map((product) => (
                    <TableRow 
                      key={product.id}
                      className="hover:bg-stockx-lightGray/30 border-b border-stockx-lightGray"
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-stockx-green font-medium">
                          ${product.currentPrice}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-stockx-green p-0"
                          onClick={() => window.open(product.url, '_blank')}
                        >
                          View on StockX
                        </Button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(product.lastScraped), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 p-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No products match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
