// components/TestKitCard.jsx
import { useState } from 'react';
import { useCart } from '../hooks/useCart';

const TestKitCard = ({ testKit }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(testKit.id, quantity);
  };
  
  return (
    <div className="test-kit-card">
      <img src={testKit.image_url} alt={testKit.name} />
      <h3>{testKit.name}</h3>
      <p>{testKit.description}</p>
      <p className="price">${testKit.price.toFixed(2)}</p>
      
      <div className="quantity-selector">
        <button 
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>
      
      <button className="add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};