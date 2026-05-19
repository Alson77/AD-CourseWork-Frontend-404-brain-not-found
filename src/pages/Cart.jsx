import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQtyChange = async (id, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }
    try {
      await api.put(`/api/cart/${id}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      alert(err.response?.data || 'Failed to update quantity');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    // Basic clear by removing one by one or we could add a clear endpoint
    for (const item of cart) {
      await api.delete(`/api/cart/${item.id}`);
    }
    setCart([]);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    setError('');

    // ── Loyalty Discount: 10% automatically applied when subtotal > Rs. 5000 ──
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = subtotal > 5000 ? Math.round(subtotal * 0.10 * 100) / 100 : 0;
    const finalTotal = subtotal - discount;

    try {
      const res = await api.post('/api/orders/checkout');
      alert(res.data?.message || 'Order placed successfully!');
      setCart([]);
      navigate('/customer-dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again later.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal > 5000 ? Math.round(subtotal * 0.10 * 100) / 100 : 0;
  const total = subtotal - discount;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <ShoppingCart size={28} />
        <h1>Shopping Cart</h1>
      </div>
      <p className="page-desc">Review the parts you have added before placing your order.</p>

      {error && <div className="error-msg" style={{marginBottom: '1rem', color: 'red'}}>{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading cart...</p>
      ) : cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>Your cart is empty.</p>
          <Link to="/catalog" className="card-btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Browse Parts
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td><span className="part-category">{item.category}</span></td>
                    <td>Rs. {item.price.toLocaleString()}</td>
                    <td>
                      <div className="qty-control">
                        <button onClick={() => handleQtyChange(item.id, -1, item.qty)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => handleQtyChange(item.id, +1, item.qty)}>+</button>
                      </div>
                    </td>
                    <td><strong>Rs. {(item.price * item.qty).toLocaleString()}</strong></td>
                    <td>
                      <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="cart-summary-details">
              <p>Total Items: <strong>{totalItems}</strong></p>
              {discount > 0 ? (
                <>
                  <p>Subtotal: <span>Rs. {subtotal.toLocaleString()}</span></p>
                  <p style={{ color: '#16a34a', fontWeight: 600 }}>
                    🏆 Gold Loyalty Discount (10%): <span>- Rs. {discount.toLocaleString()}</span>
                  </p>
                  <p className="cart-total">Total: <strong>Rs. {total.toLocaleString()}</strong></p>
                </>
              ) : (
                <>
                  {subtotal > 3000 && (
                    <p style={{ color: '#d97706', fontSize: '0.85rem' }}>
                      💡 Spend Rs. {(5000 - subtotal).toLocaleString()} more to unlock 10% Gold Loyalty discount!
                    </p>
                  )}
                  <p className="cart-total">Total: <strong>Rs. {total.toLocaleString()}</strong></p>
                </>
              )}
            </div>
            <div className="cart-actions">
              <button className="clear-btn" onClick={handleClear} disabled={placingOrder}>Clear Cart</button>
              <button className="submit-btn" style={{ width: 'auto', padding: '10px 28px' }}
                onClick={handlePlaceOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
