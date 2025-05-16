// components/LoginForm.jsx
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const LoginForm = ({ onSuccess }) => {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Transfer anonymous cart to user account
      const sessionId = localStorage.getItem('cart_session_id');
      if (sessionId) {
        await supabase.rpc('transfer_anonymous_cart', {
          p_session_id: sessionId,
          p_user_id: supabase.auth.user()?.id
        });
        localStorage.removeItem('cart_session_id');
      }
      
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="auth-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};