import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Package } from 'lucide-react';
import api from '../utils/api';

const categories = ['All', 'Engine', 'Brakes', 'Electrical', 'Cooling', 'Suspension', 'Transmission', 'Filters'];

function PartsCatalog() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [addedId, setAddedId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchParts();
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await api.get('/api/cart');
      const count = res.data.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchParts = async () => {
    try {
      const res = await api.get('/api/parts');
      // Map backend fields to what frontend expects, or use backend fields directly
      const mappedParts = res.data.map(p => ({
        id: p.id,
        name: p.partName,
        brand: p.brand,
        category: p.category,
        price: p.price,
        stock: p.stockQuantity,
        compatible: 'Universal' // Mock compatible for now
      }));
      setParts(mappedParts);
    } catch (err) {
      console.error('Failed to load parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (part) => {
    try {
      await api.post('/api/cart', { partId: part.id, quantity: 1 });
      setAddedId(part.id);
      fetchCartCount();
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      alert(err.response?.data || 'Failed to add item to cart');
    }
  };

  let filtered = parts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));



  return (
    <div className="page-container">
      <div className="page-header">
        <Package size={28} />
        <h1>Parts Catalog</h1>
        <Link to="/cart" className="cart-badge-link">
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
      <p className="page-desc">Browse our available vehicle parts. Use filters to find what you need.</p>

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by part name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      <p className="results-count">{filtered.length} part{filtered.length !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="empty-state">Loading parts...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No parts found matching your search.</div>
      ) : (
        <div className="parts-grid">
          {filtered.map((part) => (
            <div key={part.id} className="part-card">
              <div className="part-card-header">
                <span className="part-category">{part.category}</span>
                <span className={`stock-badge ${part.stock <= 5 ? 'low' : 'in'}`}>
                  {part.stock <= 5 ? `Low Stock (${part.stock})` : 'In Stock'}
                </span>
              </div>
              <h3 className="part-name">{part.name}</h3>
              <p className="part-brand">Brand: <strong>{part.brand}</strong></p>
              <p className="part-compat">Fits: {part.compatible}</p>
              <div className="part-card-footer">
                <span className="part-price">Rs. {part.price.toLocaleString()}</span>
                <button
                  className={`add-cart-btn ${addedId === part.id ? 'added' : ''}`}
                  onClick={() => handleAddToCart(part)}
                  disabled={part.stock <= 0}
                >
                  {addedId === part.id ? '✓ Added' : part.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PartsCatalog;
