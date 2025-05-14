
import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  viewMode: 'table' | 'card';
  setViewMode: (mode: 'table' | 'card') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
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
  );
};

export default ViewToggle;
