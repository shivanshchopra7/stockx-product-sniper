
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No scraped products yet",
  description = "Enter a StockX URL above to start scraping product data",
  action,
  actionLabel = "Learn More",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-stockx-lightGray rounded-lg bg-stockx-gray/30">
      <div className="flex flex-col items-center justify-center text-center max-w-md space-y-4">
        <div className="w-16 h-16 bg-stockx-gray rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-stockx-green"
          >
            <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
            <path d="m8 16 4-4 4 4" />
            <path d="M16 24v-8" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {action && (
          <Button 
            onClick={action}
            className="bg-stockx-green hover:bg-stockx-green/90 text-white"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
