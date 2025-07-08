import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found, Stripe functionality will be disabled');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

const subscriptionRequestSchema = z.object({
  email: z.string().email(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create subscription endpoint
  app.post("/api/create-subscription", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Stripe not configured. Please set STRIPE_SECRET_KEY environment variable." 
        });
      }

      const { email } = subscriptionRequestSchema.parse(req.body);
      
      // Get or create user
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ email });
      }

      // If user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
          expand: ['latest_invoice.payment_intent'],
        });
        
        if (subscription.status === 'active') {
          const latestInvoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent: Stripe.PaymentIntent };
          const paymentIntent = latestInvoice?.payment_intent;
          
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent?.client_secret,
          });
        }
      }

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
        });
        user = await storage.updateUserStripeInfo(user.id, customer.id);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_1234567890', // Fallback price ID
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent: Stripe.PaymentIntent };
      const paymentIntent = latestInvoice?.payment_intent;
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(400).json({ 
        message: error.message || "Failed to create subscription" 
      });
    }
  });

  // Stripe webhook endpoint (for Cloudflare Worker)
  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).json({ message: "Missing webhook signature or secret" });
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      switch (event.type) {
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as Stripe.Invoice & { subscription: string };
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const customer = await stripe.customers.retrieve(subscription.customer as string);
            
            if (customer && !customer.deleted) {
              const user = await storage.getUserByEmail(customer.email!);
              if (user) {
                await storage.updateUserProStatus(user.id, true);
              }
            }
          }
          break;
          
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription;
          const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
          
          if (deletedCustomer && !deletedCustomer.deleted) {
            const user = await storage.getUserByEmail(deletedCustomer.email!);
            if (user) {
              await storage.updateUserProStatus(user.id, false);
            }
          }
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
