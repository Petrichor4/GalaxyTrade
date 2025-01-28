// Home page which will diplay ItemCard.tsx component

'use client';

import { FC } from 'react';
import Inventory from './components/InventoryPanel';

const HomePage: FC = () => {
  return (
    <div>
      <h1>Welcome to GalaxyTrade 🌌</h1>
      <Inventory/>
      <p>This is the home page where you can list items available for trade.</p>
    </div>
  );
};

export default HomePage;