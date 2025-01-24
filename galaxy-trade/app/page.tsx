// Home page which will diplay ItemCard.tsx component

import { FC } from 'react';

const Home: FC = () => {
  items();
  return (
    <div>
      <h1>Welcome to GalaxyTrade 🌌</h1>
      <p>This is the home page where you can list items available for trade.</p>
    </div>
  );
};

export default Home;

export async function items() {
  try {
    const response = await fetch('http://localhost:3000/api/items/itemRoutes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('items', data);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}