import React from 'react';
import { Table, Form, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import products from '../../Core/tableData';
import './Table.css';

const ProductTable = () => {
  return (
    <>
      {/* Desktop Table */}
      <Table bordered hover responsive className="product-table d-none d-md-table">
        <thead>
          <tr>
            <th><Form.Check type="checkbox" /></th>
            <th>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Categories</th>
            <th>Tags</th>
            <th>Brands</th>
            <th>★</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className="product-row">
              <td><Form.Check type="checkbox" /></td>
              <td>
                <Link to="/" className="product-link">
                  <Image src={prod.image} rounded style={{ width: '40px', height: '40px' }} />
                </Link>
              </td>
              <td>
                <Link to="/" className="product-link">
                  <strong style={{ color: '#1e73be' }}>{prod.name}</strong>
                </Link>
                {prod.editable && (
                  <div className="hover-actions">
                    ID: 341 | <span className="text-primary">Edit</span> | <span className="text-danger">Trash</span> | View 
                  </div>
                )}
              </td>
              <td>–</td>
              <td className="text-success">In stock ({prod.stock})</td>
              <td>
                {prod.oldPrice && <del>{prod.oldPrice}</del>}<br />
                {prod.price} each
              </td>
              <td className="text-primary">{prod.category}</td>
              <td>–</td>
              <td>—</td>
              <td>{prod.isFeatured ? '⭐' : '☆'}</td>
              <td>
                Published<br />
                {prod.date}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {products.map(prod => (
          <div key={prod.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong style={{ color: '#1e73be' }}>{prod.name}</strong>
              </div>
              <div>
                {prod.isFeatured && <span className="badge bg-primary me-2">Featured</span>}
              </div>
            </div>
            <div className="text-muted small">
              Published {prod.date}
            </div>
            {prod.editable && (
              <div className="mt-2">
                <span className="text-primary me-2">Edit</span>
                <span className="text-danger me-2">Trash</span>
                <span>View</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductTable;