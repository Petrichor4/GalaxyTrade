// Home page which will diplay ItemCard.tsx component

'use client';

import Inventory from './components/InventoryPanel';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to GalaxyTrade 🌌</h1>
      <Inventory username={"testUser"} />
      <p>This is the home page where you can list items available for trade.</p>
    </div>
  );
};