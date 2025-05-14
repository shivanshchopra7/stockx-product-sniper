
import React from 'react';
import { Product } from '@/types/product';
import ProductCard from '../ProductCard';

interface CardGridViewProps {
  products: Product[];
}

const CardGridView: React.FC<CardGridViewProps> = ({ products }) => {
  return (
    <div className="grid gap-4 p-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CardGridView;
