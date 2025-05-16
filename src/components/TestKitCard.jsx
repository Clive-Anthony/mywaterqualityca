// src/components/TestKitCard.jsx
import { useState } from 'react';
import { useCart } from '../hooks/useCart';

const TestKitCard = ({ testKit }) => {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      console.log('TestKitCard handleAddToCart:', testKit.id, quantity);
      await addToCart(testKit.id, quantity);
      console.log('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
  return (
    <div className="test-kit-card bg-white p-4 rounded-lg shadow-md">
      <img 
        src={testKit.image_url || '/api/placeholder/300/200'} 
        alt={testKit.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-bold mb-2">{testKit.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{testKit.description}</p>
      <p className="text-xl font-semibold text-blue-600 mb-4">${testKit.price.toFixed(2)}</p>
      
      <div className="flex items-center border rounded-md w-1/2 mx-auto mb-4">
        <button 
          className="px-3 py-1 text-gray-700"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-3 py-1 flex-1 text-center">{quantity}</span>
        <button 
          className="px-3 py-1 text-gray-700"
          onClick={() => setQuantity(q => q + 1)}
        >
          +
        </button>
      </div>
      
      <button 
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex justify-center items-center"
        onClick={handleAddToCart}
        disabled={addingToCart}
      >
        {addingToCart ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default TestKitCard;