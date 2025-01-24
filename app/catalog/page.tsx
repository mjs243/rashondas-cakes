import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
}

export default async function CatalogPage() {
    // 1. Fetch the products from Keystone
    const products = await getAllProducts();

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-pink-800 mb-6">Our Catalog</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-md shadow-md p-4">
                        <div className="relative w-full h-48 mb-4">
                            <Image
                                src={product.imageUrl ?? '/images/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-pink-700">{product.name}</h2>
                        <p className="text-gray-500 mt-1">${(product.price / 100).toFixed(2)}</p>
                        {product.description && (
                            <p className="text-gray-700 mt-2 line-clamp-2">{product.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

async function getAllProducts(): Promise<Product[]> {
    const endpoint = 'http://localhost:3001/api/graphql';
    const query = `
        query {
            products {
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
        throw new Error('Failed to fetch products from Keystone');
    }

    const json = await res.json();
    const products = json.data.products ?? [];
    const baseUrl = process.env.NEXT_PUBLIC_KEYSTONE_URL;

    return products.map((p: any) => {
        const relativeUrl = p.productImage?.url || '/images/placeholder.jpg';
        const fullUrl = `${baseUrl}${relativeUrl}`;
        console.log(fullUrl);

        return {
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            imageUrl: fullUrl,
        };
    });
}