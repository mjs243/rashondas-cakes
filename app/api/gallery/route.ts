// app/api/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const galleryName = searchParams.get('name');
    const baseUrl = process.env.KEYSTONE_URL ?? "http://localhost:3001";
    
    // Query the KeystoneJS GraphQL API
    const query = `
      query GetGallery($name: String!) {
        galleries(where: { name: { equals: $name } }) {
          id
          name
          description
          images {
            id
            altText
            image {
              url
              width
              height
            }
          }
        }
      }
    `;
    
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { name: galleryName || 'Cake Gallery' },
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch from KeystoneJS API');
    }
    
    const { data } = await response.json();
    
    // Return the first gallery that matches the name, with adjusted image URLs
    if (data.galleries && data.galleries.length > 0) {
      const gallery = data.galleries[0];
      
      // Fix image URLs
      if (gallery.images && gallery.images.length > 0) {
        gallery.images = gallery.images.map((image: any) => {
          if (image.image && image.image.url) {
            // If URL already starts with http/https, return as is
            if (!image.image.url.startsWith('http://') && !image.image.url.startsWith('https://')) {
              image.image.url = `${baseUrl}${image.image.url}`;
            }
          }
          return image;
        });
      }
      
      return NextResponse.json(gallery);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery data' },
      { status: 500 }
    );
  }
}