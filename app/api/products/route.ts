import { NextResponse } from "next/server";

export async function GET() {
  const endpoint = "http://localhost:3001/api/graphql";

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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });

  const json = await res.json();
  return NextResponse.json(json.data.products);
}
