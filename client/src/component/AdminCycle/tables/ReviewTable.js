import React, { useState } from 'react';
import { Table, Form, Button, Dropdown, Col, Row, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Table.css';

const ReviewsTable = () => {
  // Sample review data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: 'Premium Widget',
      reviewer: 'John Doe',
      email: 'john.doe@example.com',
      rating: 5,
      review: 'Excellent product! Works perfectly and exceeded my expectations.',
      date: '2023-06-15',
      status: 'published',
      actionHistory: [
        { date: '2023-06-15', action: 'Review published' }
      ]
    },
    {
      id: 2,
      product: 'Basic Widget',
      reviewer: 'Jane Smith',
      email: 'jane.smith@example.com',
      rating: 3,
      review: 'Average product. Could be better with more features.',
      date: '2023-06-10',
      status: 'pending',
      actionHistory: [
        { date: '2023-06-10', action: 'Review submitted' }
      ]
    },
    {
      id: 3,
      product: 'Deluxe Widget',
      reviewer: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      rating: 1,
      review: 'Terrible experience. Product arrived damaged.',
      date: '2023-06-05',
      status: 'unpublished',
      actionHistory: [
        { date: '2023-06-05', action: 'Review submitted' },
        { date: '2023-06-06', action: 'Review unpublished' }
      ]
    },
  ]);

  const bulkActions = [
    { value: '', label: 'Bulk actions', selected: true },
    { value: 'publish', label: 'Publish' },
    { value: 'unpublish', label: 'Unpublish' },
    { value: 'delete', label: 'Delete' }
  ];

  const statusOptions = [
    { value: '', label: 'Filter by status', selected: true },
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'pending', label: 'Pending' },
    { value: 'unpublished', label: 'Unpublished' }
  ];

  const renderOptions = (options) => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

  const renderActionHistory = (history) => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="link" id="dropdown-action-history">
          View History
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {history.map((item, index) => (
            <Dropdown.Item key={index}>
              <div className="small">{item.date}</div>
              <div>{item.action}</div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const toggleReviewStatus = (id, newStatus) => {
    setReviews(reviews.map(review => {
      if (review.id === id) {
        const action = newStatus === 'published' ? 'Review published' : 'Review unpublished';
        return {
          ...review,
          status: newStatus,
          actionHistory: [
            ...review.actionHistory,
            { date: new Date().toISOString().split('T')[0], action }
          ]
        };
      }
      return review;
    }));
  };

  const handleBulkAction = (action) => {
    // In a real app, you would implement bulk actions here
    console.log(`Bulk action: ${action}`);
  };

  const renderStatusBadge = (status) => {
    const variants = {
      published: 'success',
      pending: 'warning',
      unpublished: 'secondary'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>★</span>
    ));
  };

  return (
    <>
      <div className="filter-bar-container mb-3 p-3 bg-light rounded">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="filter-actions-container" style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Select 
                name="bulk_action" 
                className="filter-select me-2"
                onChange={(e) => handleBulkAction(e.target.value)}
              >
                {renderOptions(bulkActions)}
              </Form.Select>
              
              <Button 
                name="apply_bulk_action" 
                value="Apply" 
                className="filter-button me-2"
                onClick={() => handleBulkAction(document.querySelector('[name="bulk_action"]').value)}
              >
                Apply
              </Button>

              <Form.Select name="filter_status" className="filter-select me-2">
                {renderOptions(statusOptions)}
              </Form.Select>
            </div>
          </Col>
          
          <Col md={4}>
            <div className="search-container">
              <h5>Search Reviews</h5>
              <Form.Control 
                type="text" 
                placeholder="Search reviews..." 
              />
              <div className="text-muted small mt-1">
                {reviews.length} items
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Desktop Table */}
      <div className="flex flex-row" style={{marginTop:'7%'}}>
        <Table bordered hover responsive className="bistik-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Product</th>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className="product-row">
                <td><Form.Check type="checkbox" /></td>
                <td>
                  <Link to="/" className="product-link">
                    <strong className='post-title'>{review.product}</strong>
                  </Link>
                </td>
                <td>
                  {review.reviewer}
                  <div className="text-muted small">{review.email}</div>
                </td>
                <td>{renderStars(review.rating)}</td>
                <td>
                  <div className="review-excerpt">
                    {review.review.length > 50 ? 
                      `${review.review.substring(0, 50)}...` : 
                      review.review}
                  </div>
                </td>
                <td>{review.date}</td>
                <td>{renderStatusBadge(review.status)}</td>
                <td>
                  <div className="d-flex gap-2">
                    {review.status !== 'published' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => toggleReviewStatus(review.id, 'published')}
                      >
                        Publish
                      </Button>
                    )}
                    {review.status === 'published' && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => toggleReviewStatus(review.id, 'unpublished')}
                      >
                        Unpublish
                      </Button>
                    )}
                    <Button variant="danger" size="sm">Delete</Button>
                    {renderActionHistory(review.actionHistory)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8" className="text-muted small">
                {reviews.length} items
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {reviews.map(review => (
          <div key={review.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong className='post-title'>{review.product}</strong>
              </div>
              <div>
                {renderStatusBadge(review.status)}
              </div>
            </div>
            <div className="text-muted small mt-2">
              Reviewer: {review.reviewer} ({review.email})
            </div>
            <div className="mt-2">
              Rating: {renderStars(review.rating)}
            </div>
            <div className="mt-2">
              Review: {review.review.length > 30 ? 
                `${review.review.substring(0, 30)}...` : 
                review.review}
            </div>
            <div className="small mt-2">
              Date: {review.date}
            </div>
            <div className="mt-2 d-flex gap-2">
              {review.status !== 'published' && (
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => toggleReviewStatus(review.id, 'published')}
                >
                  Publish
                </Button>
              )}
              {review.status === 'published' && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => toggleReviewStatus(review.id, 'unpublished')}
                >
                  Unpublish
                </Button>
              )}
              <Button variant="danger" size="sm">Delete</Button>
              <Dropdown>
                <Dropdown.Toggle variant="link" size="sm" id="dropdown-mobile-history" className='history'>
                  History
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {review.actionHistory.map((item, index) => (
                    <Dropdown.Item key={index}>
                      <div className="small">{item.date}</div>
                      <div>{item.action}</div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}
        <div className="text-muted small mt-2">
          {reviews.length} items
        </div>
      </div>
    </>
  );
};

export default ReviewsTable;