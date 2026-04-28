import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Package } from 'lucide-react';
import parts from '../data/partsData';

const categories = ['All', 'Engine', 'Brakes', 'Electrical', 'Cooling', 'Suspension', 'Transmission'];

function PartsCatalog({ cart, setCart }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (part) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.id === part.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...part, qty: 1 }];
    });
    setAddedId(part.id);
    setTimeout(() => setAddedId(null), 1500);
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

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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

      {/* Parts Grid */}
      {filtered.length === 0 ? (
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
                >
                  {addedId === part.id ? '✓ Added' : 'Add to Cart'}
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
