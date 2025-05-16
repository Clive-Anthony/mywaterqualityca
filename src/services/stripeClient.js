// src/services/stripeClient.js
// Mock Stripe implementation to prevent errors
export const loadStripe = () => {
    console.log('Mock Stripe loading - stripe integration is disabled');
    return Promise.resolve({
      elements: () => ({
        getElement: () => null
      }),
      confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } })
    });
  };
  
  export const Elements = ({ children }) => children;
  export const CardElement = () => null;
  export const useStripe = () => ({});
  export const useElements = () => ({});