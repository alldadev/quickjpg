interface Env {
  QUICKJPG_PRO_USERS: KVNamespace;
  STRIPE_WEBHOOK_SECRET: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response('No signature provided', { status: 400 });
    }

    // Verify webhook signature (simplified)
    // In production, use proper Stripe webhook verification
    const event = JSON.parse(body);
    
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        if (invoice.customer_email) {
          await env.QUICKJPG_PRO_USERS.put(invoice.customer_email, 'true');
        }
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        if (subscription.customer?.email) {
          await env.QUICKJPG_PRO_USERS.delete(subscription.customer.email);
        }
        break;
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
