
import React, { useState } from 'react';
import { Product, SortConfig } from '@/types/product';
import ViewToggle from './ui/ViewToggle';
import SearchBar from './ui/SearchBar';
import ExportButtons from './tables/ExportButtons';
import TableView from './tables/TableView';
import CardGridView from './tables/CardGridView';

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

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ExportButtons products={products} />
      </div>

      <div className="bg-stockx-dark rounded-lg border border-stockx-lightGray overflow-hidden">
        {sortedProducts.length > 0 ? (
          viewMode === 'table' ? (
            <TableView 
              products={sortedProducts} 
              sortConfig={sortConfig} 
              handleSort={handleSort} 
            />
          ) : (
            <CardGridView products={sortedProducts} />
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
