import { ShoppingCart, Trash2 } from 'lucide-react';

function Cart({ cart, setCart }) {
  const handleQtyChange = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClear = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <ShoppingCart size={28} />
        <h1>Shopping Cart</h1>
      </div>
      <p className="page-desc">Review the parts you have added before placing your order.</p>

      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p>Your cart is empty.</p>
          <a href="/catalog" className="card-btn" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Browse Parts
          </a>
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
                        <button onClick={() => handleQtyChange(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => handleQtyChange(item.id, +1)}>+</button>
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
              <p className="cart-total">Total: <strong>Rs. {total.toLocaleString()}</strong></p>
            </div>
            <div className="cart-actions">
              <button className="clear-btn" onClick={handleClear}>Clear Cart</button>
              <button className="submit-btn" style={{ width: 'auto', padding: '10px 28px' }}
                onClick={() => alert('Order placed! (Backend integration pending)')}>
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
