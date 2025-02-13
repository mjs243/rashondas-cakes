import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import HomeClient from "./HomeClient";
import AboutOwner from "./AboutOwner";

// Data interface to match Keystone fields
interface Cake {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
}

export default async function HomePage() {
  // 1. Fetech Featured Cakes from Keystone via GraphQL
  const featuredCakes = await getFeaturedCakes();

  return (
    <>
      {/* Hero Seciton */}
      <HeroCarousel />

      {/* Featured Cakes Section */}
      <HomeClient featuredCakes={featuredCakes} />

      {/* About the Owner Section */}
      <AboutOwner />
    </>
  );
}

/**
 * Fetch Featured Cakes from Keystone
 */
async function getFeaturedCakes(): Promise<Cake[]> {
  const endpoint = 'http://localhost:3001/api/graphql';

  const query = `
    query {
      products(where: { isFeatured: { equals: true } }) {
        id
        name
        price
        description
        productImage {
          url
        }
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    throw new Error('Failed to fetch featured cakes from Keystone');
  }

  const json = await res.json();
  const products = json.data.products ?? [];
  const baseUrl = process.env.NEXT_PUBLIC_KEYSTONE_URL;


  // Map response to match Cake interface
  return products.map((p: any) => {
    const relativeUrl = p.productImage?.url || '/images/placeholder.jpg';
    const fullUrl = `${baseUrl}${relativeUrl}`;
    console.log(fullUrl);
    
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description || '',
      imageUrl: fullUrl,
      isFeatured: true,
    };
  });
}

