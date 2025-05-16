import React from 'react';
import { Table, Form, Image,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import products from '../../Core/tableData';
import FilterBar from '../FilterBar/FilterBar'
import './Table.css';

const ProductTable = () => {
  return (
    <>
     <div className="flex flex-row">
        <Button name="bulk_action" value="Apply" className="filter-button">
          Add New Offer
        </Button>
      </div>
      <div className="flex flex-row">
        <FilterBar />
      </div>
      {/* Desktop Table */}
      <Table bordered hover responsive className="bistik-table d-none d-md-table" style={{marginTop:'5%'}}>
        <thead>
          <tr>
            <th className="select-column"><Form.Check type="checkbox" /></th>
            <th>Image</th>
            <th className="title-column">Name</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Price</th>
            <th className="categories-column">Categories</th>
            <th className="tags-column">Tags</th>
            <th>Brands</th>
            <th>★</th>
            <th className="date-column">Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className={prod.selected ? "selected-row" : undefined}>
              <td className="select-column"><Form.Check type="checkbox" /></td>
              <td>
                <Link to="/" className="post-title">
                  <Image src={prod.image} rounded style={{ width: '40px', height: '40px' }} />
                </Link>
              </td>
              <td className="title-column">
                <Link to="/" className="post-title">
                  <strong>{prod.name}</strong>
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
              <td className="categories-column text-primary">{prod.category}</td>
              <td className="tags-column">–</td>
              <td>—</td>
              <td>{prod.isFeatured ? '⭐' : '☆'}</td>
              <td className="date-column">
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
                <strong className="post-title">{prod.name}</strong>
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