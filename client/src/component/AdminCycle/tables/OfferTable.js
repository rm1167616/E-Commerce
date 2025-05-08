import React from 'react';
import { Table, Form, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FilterBar from '../FilterBar/FilterBar'
import './Table.css';

const OffersTable = () => {
  // Sample offer data - replace with your actual data
  const offers = [
    {
      id: 1,
      name: 'Summer Sale',
      image: 'https://via.placeholder.com/40',
      percentage: '20%',
      productsCount: 15,
      category: 'Electronics',
      categoriesCount: 3,
      startDate: '2023-06-01',
      endDate: '2023-08-31'
    },
    {
      id: 2,
      name: 'Winter Clearance',
      image: 'https://via.placeholder.com/40',
      percentage: '30%',
      productsCount: 25,
      category: 'Clothing',
      categoriesCount: 5,
      startDate: '2023-11-15',
      endDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'Black Friday',
      image: 'https://via.placeholder.com/40',
      percentage: '50%',
      productsCount: 42,
      category: 'Home Appliances',
      categoriesCount: 7,
      startDate: '2023-11-24',
      endDate: '2023-11-27'
    },
  ];

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
      <div className="flex flex-row" style={{ marginTop: '8%' }}>
        <Table bordered hover responsive className="product-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Image</th>
              <th>Offer Name</th>
              <th>Discount</th>
              <th>Products</th>
              <th>Category</th>
              <th>Categories</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id} className="product-row">
                <td><Form.Check type="checkbox" /></td>
                <td>
                  <Image src={offer.image} rounded style={{ width: '40px', height: '40px' }} />
                </td>
                <td>
                  <Link to="/" className="product-link">
                    <strong style={{ color: '#1e73be' }}>{offer.name}</strong>
                  </Link>
                  <div className="hover-actions">
                    ID: {offer.id} | <span className="text-primary">Edit</span> | <span className="text-danger">Trash</span> | View 
                  </div>
                </td>
                <td>{offer.percentage}</td>
                <td>{offer.productsCount}</td>
                <td>{offer.category}</td>
                <td>{offer.categoriesCount}</td>
                <td>{offer.startDate}</td>
                <td>{offer.endDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {offers.map(offer => (
          <div key={offer.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Image src={offer.image} rounded style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                <strong style={{ color: '#1e73be' }}>{offer.name}</strong>
              </div>
              <div>
                <span className="badge bg-secondary">{offer.percentage}</span>
              </div>
            </div>
            <div className="text-muted small mt-2">
              Products: {offer.productsCount} | Categories: {offer.categoriesCount}
            </div>
            <div className="mt-2">
              Category: {offer.category}
            </div>
            <div className="d-flex justify-content-between small mt-2">
              <span>Start: {offer.startDate}</span>
              <span>End: {offer.endDate}</span>
            </div>
            <div className="mt-2">
              <span className="text-primary me-2">Edit</span>
              <span className="text-danger me-2">Trash</span>
              <span>View</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OffersTable;