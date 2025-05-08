import React from 'react';
import { Table, Form, Image ,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import products from '../../Core/tableData';
import FilterBar from '../FilterBar/FilterBar'
import './Table.css';

const SimpleTable = () => {
  return (
    <>
         <div className="flex flex-row">
         <Button name="bulk_action" value="Apply" className="filter-button" >
              Add Categories
            </Button>
    </div>
       <div className="flex flex-row">
      <FilterBar />
    </div>
      {/* Desktop Table */}
      <div className="flex flex-row" style={{marginTop:'5%'}}>
      <Table bordered hover responsive className="product-table d-none d-md-table">
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
                    ID: {prod.id} | <span className="text-primary">Edit</span> | <span className="text-danger">Trash</span> | View 
                  </div>
                )}
              </td>
              <td>{prod.description || 'data about the categore'}</td>
              <td>{prod.count || '10'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {products.map(prod => (
          <div key={prod.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Image src={prod.image} rounded style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                <strong style={{ color: '#1e73be' }}>{prod.name}</strong>
              </div>
              <div>
                <span className="badge bg-secondary">{prod.count || 0}</span>
              </div>
            </div>
            <div className="text-muted small mt-2">
              {prod.description || 'No description'}
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

export default SimpleTable;