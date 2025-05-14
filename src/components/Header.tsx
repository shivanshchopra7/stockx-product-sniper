
import React from 'react';

const Header = () => {
  return (
    <header className="bg-stockx-dark border-b border-stockx-lightGray py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            Stock<span className="text-stockx-green">X</span> Scraper
          </h1>
          <span className="bg-stockx-green text-xs px-2 py-1 rounded-md text-white">BETA</span>
        </div>
        <div className="text-sm text-stockx-green font-medium">
          Web Scraping Tool
        </div>
      </div>
    </header>
  );
};

export default Header;
