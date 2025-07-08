import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/thanks",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to QuickJPG Pro!",
      });
    }
    
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : "Subscribe to Pro"}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Unable to load subscription. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Subscribe to QuickJPG Pro</CardTitle>
              <p className="text-center text-muted-foreground">
                Convert up to 20 files at once with no ads
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$9.99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>
              
              {stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <SubscribeForm />
                </Elements>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Stripe is not configured. Please contact support.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Return to Home
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
