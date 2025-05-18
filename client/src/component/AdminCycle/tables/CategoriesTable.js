import React, { useEffect, useState } from 'react';
import { Table, Form, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FilterBar from '../FilterBar/FilterBar';
import './Table.css';

const SimpleTable = ({ onAction, onAddCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/admin/categories')
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to fetch categories');
        }
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setCategories(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
        } catch (parseErr) {
          setCategories([]);
          setError(null);
          // Optionally, you can alert here: alert('No categories added yet.');
          return;
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex flex-row">
        <Link to="/admin/AddCategory">
          <Button name="bulk_action" value="Apply" className="filter-button">
            Add Categories
          </Button>
        </Link>
      </div>
      <div className="flex flex-row">
        <FilterBar />
      </div>
      {loading && <div>Loading categories...</div>}
      {error && <div style={{ color: 'white', background: 'red', padding: '8px', borderRadius: '4px', margin: '8px 0' }}>{error}</div>}
      {/* Desktop Table */}
      <div className="flex flex-row" style={{ marginTop: '8%' }}>
        <Table bordered hover responsive className="bistik-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={5} className="text-center text-muted">No categories added yet</td>
              </tr>
            )}
            {categories.map(cat => (
              <tr key={cat.id} className="product-row">
                <td><Form.Check type="checkbox" /></td>
                <td>
                  <Link to="#" className="product-link">
                    <Image src={cat.thumbnail || require('../../../Assets/Images/full.png')} rounded style={{ width: '40px', height: '40px' }} />
                  </Link>
                </td>
                <td>
                  <Link to="#" className="product-link">
                    <strong className="post-title">{cat.name}</strong>
                  </Link>
                  <div className="hover-actions">
                    ID: {cat.id} | <span className="text-primary" onClick={() => onAction && onAction('edit', cat)}>Edit</span> | <span className="text-danger" onClick={() => onAction && onAction('trash', cat)}>Trash</span> | <span onClick={() => onAction && onAction('view', cat)}>View</span>
                  </div>
                </td>
                <td>{cat.description || 'No description'}</td>
                <td>{cat.productCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {categories.length === 0 && !loading && !error && (
          <div className="text-center text-muted">No categories added yet</div>
        )}
        {categories.map(cat => (
          <div key={cat.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Image src={cat.thumbnail || require('../../../Assets/Images/full.png')} rounded style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                <strong className="post-title">{cat.name}</strong>
              </div>
              <div>
                <span className="badge bg-secondary">{cat.productCount || 0}</span>
              </div>
            </div>
            <div className="text-muted small mt-2">
              {cat.description || 'No description'}
            </div>
            <div className="mt-2">
              <span className="text-primary me-2" onClick={() => onAction && onAction('edit', cat)}>Edit</span>
              <span className="text-danger me-2" onClick={() => onAction && onAction('trash', cat)}>Trash</span>
              <span onClick={() => onAction && onAction('view', cat)}>View</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SimpleTable;