import React from 'react';
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
import { format } from 'date-fns';

interface TableViewProps {
  products: Product[];
  sortConfig: SortConfig;
  handleSort: (key: keyof Product) => void;
}

const TableView: React.FC<TableViewProps> = ({ products, sortConfig, handleSort }) => {
  return (
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
          {products.map((product, index) => (
            <TableRow 
              key={product.id || product.name || index}
              className="hover:bg-stockx-lightGray/30 border-b border-stockx-lightGray"
            >
              <TableCell className="font-medium">{product.name || '—'}</TableCell>
              <TableCell>{product.brand || '—'}</TableCell>
              <TableCell className="text-right">
                {product.currentPrice !== undefined ? (
                  <span className="text-stockx-green font-medium">
                    ${product.currentPrice}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                {product.url ? (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-stockx-green p-0"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    View on StockX
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.lastScraped ? format(new Date(product.lastScraped), 'MMM d, yyyy') : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
