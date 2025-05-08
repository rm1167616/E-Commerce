import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Image, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor';

const ProductPage = () => {
  // ... existing state declarations ...

  // Add state for categories and active tab
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Seafood',
      subcategories: [
        { id: 101, name: 'Fresh Fish', checked: false, count: 24 },
        { id: 102, name: 'Fresh Shellfish', checked: false, count: 18 },
        { id: 103, name: 'Frozen Fish', checked: false, count: 32 }
      ],
      checked: false,
      count: 74
    },
    {
      id: 2,
      name: 'Vegan Meat',
      subcategories: [
        { id: 201, name: 'Bacon', checked: false, count: 15 },
        { id: 202, name: 'Beef', checked: false, count: 22 },
        { id: 203, name: 'Burgers', checked: false, count: 45 }
      ],
      checked: false,
      count: 82
    }
  ]);

  // Filter most used categories (for demo purposes, we'll use count > 20)
  const mostUsedCategories = categories.map(category => ({
    ...category,
    subcategories: category.subcategories.filter(sub => sub.count > 20)
  })).filter(category => category.subcategories.length > 0 || category.count > 20);

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const newChecked = !category.checked;
        return {
          ...category,
          checked: newChecked,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            checked: newChecked
          }))
        };
      }
      return category;
    }));
  };

  // Handle subcategory checkbox change
  const handleSubcategoryChange = (categoryId, subcategoryId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const updatedSubs = category.subcategories.map(sub => {
          if (sub.id === subcategoryId) {
            return { ...sub, checked: !sub.checked };
          }
          return sub;
        });
        
        const allSubsChecked = updatedSubs.every(sub => sub.checked);
        
        return {
          ...category,
          subcategories: updatedSubs,
          checked: allSubsChecked
        };
      }
      return category;
    }));
  };

  // ... rest of your existing code ...

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8}>
          {/* ... your existing form content ... */}
        </Col>

        <Col md={4}>
          {/* ... your existing publish and product image cards ... */}

          {/* Add the new Categories Card */}
          <Card className="mb-4">
            <Card.Header as="h5">Product categories</Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Search categories" 
                  className="mb-3"
                />
                
                <div className="d-flex border-bottom mb-3">
                  <Button 
                    variant="link" 
                    className={`p-0 me-3 text-decoration-none ${activeTab === 'all' ? 'fw-bold' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All categories
                  </Button>
                  <Button 
                    variant="link" 
                    className={`p-0 text-decoration-none ${activeTab === 'mostUsed' ? 'fw-bold' : ''}`}
                    onClick={() => setActiveTab('mostUsed')}
                  >
                    Most Used
                  </Button>
                </div>
                
                <Table borderless hover className="categories-table">
                  <tbody>
                    {(activeTab === 'all' ? categories : mostUsedCategories).map((category) => (
                      <React.Fragment key={category.id}>
                        <tr>
                          <td width="20">
                            <Form.Check
                              type="checkbox"
                              checked={category.checked}
                              onChange={() => handleCategoryChange(category.id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex justify-content-between">
                              <span>{category.name}</span>
                              <span className="text-muted">{category.count}</span>
                            </div>
                          </td>
                        </tr>
                        {category.subcategories.map((subcategory) => (
                          <tr key={subcategory.id} className="subcategory-row">
                            <td width="20">
                              <Form.Check
                                type="checkbox"
                                checked={subcategory.checked}
                                onChange={() => handleSubcategoryChange(category.id, subcategory.id)}
                              />
                            </td>
                            <td>
                              <div className="d-flex justify-content-between ms-3">
                                <span>{subcategory.name}</span>
                                <span className="text-muted">{subcategory.count}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <Button variant="link" className="p-0">
                + Add new category
              </Button>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;