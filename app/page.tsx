import Image from "next/image";

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
      {/* Hero Section */}
      <section className="relative bg-pink-100 h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-pink-200 opacity-70"></div>
        <div className="relative z-10 text-center max-w-xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-pink-800 mb-4">
            Taste the Sweetness
          </h1>
          <p className="text-pink-700 mb-6">
            Indulge in our handcrafted cakes, baked fresh with love.
          </p>
          <a
            href="/catalog"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-pink-800 mb-8">Featured Cakes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition"
            >
              <div className="relative w-full h-48 mb-4">
                {/* We'll use next/image for optimization */}
                <Image
                  src={cake.imageUrl}
                  alt={cake.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-pink-700">{cake.name}</h3>
              <p className="text-gray-500 mt-1">${(cake.price / 100).toFixed(2)}</p>
              <p className="text-gray-700 mt-2 line-clamp-2">{cake.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the Owner */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-pink-800 mb-4">
            About Rashonda
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <Image
                src={`${process.env.NEXT_PUBLIC_KEYSTONE_URL}/images/rashonda.webp`} // place a real image in `public/images/`
                alt="Rashonda"
                width={400}
                height={400}
                className="rounded-md object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-gray-700 mb-4">
                Hi, I’m Rashonda! For as long as I can remember, I’ve had a
                passion for bringing people together through sweet treats. From
                my very first cake recipe to the wide variety of delectable
                confections offered today, my mission has always been the same:
                create homemade, premium-quality desserts that spark joy and
                celebration.
              </p>
              <p className="text-gray-700">
                Every cake we bake is handcrafted with fresh ingredients,
                careful attention to detail, and a generous dash of love. Thank
                you for stopping by — I hope our treats bring a smile to your
                face!
              </p>
            </div>
          </div>
        </div>
      </section>
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

