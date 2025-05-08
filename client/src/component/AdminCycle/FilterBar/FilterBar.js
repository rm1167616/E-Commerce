import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './FilterBar.css';
import {
  bulkActions,
  categories,
  productTypes,
  stockStatuses,
  brands
} from '../../Core/FilterBar';

const ProductFilterBar = () => {
  const renderOptions = (options) => {
    return options.map((option) => (
      <option 
        key={option.value} 
        value={option.value}
        selected={option.selected}
        style={option.indent ? { paddingLeft: `${option.indent}em` } : {}}
      >
        {option.label}
        {option.count !== undefined ? ` (${option.count})` : ''}
      </option>
    ));
  };

  return (
    <div className="filter-bar-container">
      <Row>
        <Col md={8}>
          <div className="filter-actions-container" style={{display:'flex' , marginBottom:'1%'}}>
            <Form.Select name="action" className="filter-select">
              {renderOptions(bulkActions)}
            </Form.Select>
            
            <Button name="bulk_action" value="Apply" className="filter-button">
              Apply
            </Button>
            </div>
          </Col>
            <Col md={8}>
            <div className="filter-actions-container" style={{display:'flex' }}>
            <Form.Select name="product_cat" className="filter-select">
              {renderOptions(categories)}
            </Form.Select>
            
            <Form.Select name="product_type" className="filter-select">
              {renderOptions(productTypes)}
            </Form.Select>
            
            <Form.Select name="stock_status" className="filter-select">
              {renderOptions(stockStatuses)}
            </Form.Select>
            
            <Form.Select name="product_brand" className="filter-select">
              {renderOptions(brands)}
            </Form.Select>
            
            <Button name="filter_action" value="Filter" className="filter-button">
              Filter
            </Button>
          </div>
        </Col>
        
        <Col md={4}>
          <div className="pagination-container">
            <span className="item-count">0 items</span>
            
            <span>
              <span aria-hidden="true" className="filter-button pagination-button-disabled">
                «
              </span>
              
              <span aria-hidden="true" className="filter-button pagination-button-disabled">
                ‹
              </span>
              
              <span>
                <Form.Control 
                  type="text" 
                  name="paged" 
                  value="1" 
                  size="1"
                  className="page-input"
                />
                
                <span> of <span style={{ marginRight: '2px' }}>0</span></span>
              </span>
              
              <Button href="?paged=2" className="pagination-button">
                <span aria-hidden="true">›</span>
              </Button>
              
              <Button href="?paged=2" className="pagination-button">
                <span aria-hidden="true">»</span>
              </Button>
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductFilterBar;