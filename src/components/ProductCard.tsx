import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    images = [],
    name = 'Unknown Product',
    brand = 'Unknown Brand',
    description = '',
    currentPrice = 0,
    sizes = [],
    url = '#',
  } = product;

  return (
    <Card className="w-full bg-stockx-gray border-stockx-lightGray overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4">
          {images.length > 0 ? (
            <div className="relative aspect-square rounded-md overflow-hidden">
              <img
                src={images[0]}
                alt={name}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>

        <CardContent className="md:w-2/3 p-6 space-y-4">
          <div>
            <Badge className="mb-2 bg-stockx-green text-white">{brand}</Badge>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-muted-foreground mt-1 line-clamp-2">
              {description || 'No description available.'}
            </p>
          </div>

          <Separator className="bg-stockx-lightGray" />

          <div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Price</span>
              <span className="text-xl font-bold text-stockx-green">${currentPrice}</span>
            </div>

            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Available Sizes</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.length > 0 ? (
                  sizes.slice(0, 5).map((size, idx) => (
                    <Badge
                      key={idx}
                      variant={size.available ? 'default' : 'outline'}
                      className={size.available ? 'bg-stockx-lightGray' : 'text-muted-foreground'}
                    >
                      {size.size}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No size data</span>
                )}
                {sizes.length > 5 && (
                  <Badge variant="outline">+{sizes.length - 5} more</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-stockx-lightGray hover:bg-stockx-lightGray"
            >
              View Details
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-stockx-green hover:bg-stockx-green/90"
              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            >
              Visit on StockX
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;
