import React from 'react';
import { Table, Form, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import pages from '../../Core/pageData';
import FilterBar from '../FilterBar/FilterBar';
import './Table.css';

const PagesTable = () => {
  return (
    <>
      <div className="flex flex-row">
        <Button name="bulk_action" value="Apply" className="filter-button">
          Add Page
        </Button>
      </div>
   
      
      {/* Desktop Table */}
      <div className="flex flex-row" style={{ marginTop: '2%' }}>
        <Table bordered hover responsive className="product-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} className="product-row">
                <td><Form.Check type="checkbox" /></td>
                <td>
                  <Link to="/" className="product-link">
                    <strong style={{ color: '#1e73be' }}>{page.name}</strong>
                  </Link>
                  {page.editable && (
                    <div className="hover-actions">
                      ID: {page.id} | <span className="text-primary">Edit</span> | <span className="text-danger">Trash</span> | View 
                    </div>
                  )}
                </td>
                <td>{page.description || 'Page description'}</td>
                <td>
                  <span className={`badge ${page.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                    {page.status || 'draft'}
                  </span>
                </td>
                <td>{page.lastModified || '2023-11-15'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {pages.map(page => (
          <div key={page.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong style={{ color: '#1e73be' }}>{page.name}</strong>
              </div>
              <div>
                <span className={`badge ${page.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                  {page.status || 'draft'}
                </span>
              </div>
            </div>
            <div className="text-muted small mt-2">
              {page.description || 'No description'}
            </div>
            <div className="text-muted small mt-1">
              Last modified: {page.lastModified || '2023-11-15'}
            </div>
            {page.editable && (
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

export default PagesTable;