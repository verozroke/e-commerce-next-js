import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import db from '@/lib/prisma.db'
import { NextApiRequest } from 'next'

export async function POST(req: NextApiRequest) {

  const signature = req.headers['stripe-signature'] as string;
  let event: Stripe.Event

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse('Webhook Error: ' + error.message, { status: 400 })
  }


  const session = event.data.object as Stripe.Checkout.Session
  const address = session.customer_details?.address

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  if (event.type === 'checkout.session.completed') {
    const order = await db.order.update({
      where: {
        id: session.metadata?.orderId
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || ''
      },
      include: {
        orderItems: true
      }
    })

    const productIds = order.orderItems.map(orderItem => orderItem.productId)

    await db.product.updateMany({
      where: {
        id: {
          in: [...productIds]
        }
      },
      data: {
        isArchived: true
      }
    })

  }
  return new NextResponse(null, { status: 200 })

}



const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};
