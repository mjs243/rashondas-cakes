import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Readable } from 'stream';

// You must disable the default body parser to read raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

/**
 * Convert the Request (web API) to a Node.js readable stream for raw body parsing.
 */
async function toNodeReadable(req: Request): Promise<NodeJS.ReadableStream> {
  const buf = Buffer.from(await req.arrayBuffer());
  const stream = new Readable();
  stream.push(buf);
  stream.push(null);
  return stream;
}

/**
 * Export a named POST function, so Next.js knows how to handle POST requests here.
 */
export async function POST(req: Request) {
  let event: Stripe.Event;
  let rawBody: Buffer;

  try {
    // Convert the request to a Node.js readable stream
    const stream = await toNodeReadable(req);

    // The raw body as a Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    rawBody = Buffer.concat(chunks);

    const signature = req.headers.get('stripe-signature') ?? '';

    // Verify the Stripe event
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook Error:', error.message || error);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  // Handle the event by type
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        // e.g., mark order as paid in your DB
        break;
      }

      // ...handle other event types

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
