import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  FormControl, 
  FormLabel, 
  FormSelect,
  Image,
  Alert,
  Table
} from 'react-bootstrap';
import './Form.css';

const OfferForm = () => {
  const [offer, setOffer] = useState({
    name: '',
    discount: '',
    discountType: 'percentage',
    image: null,
    startDate: '',
    endDate: '',
    description: ''
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' }
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: 'Smartphone', price: 599.99, category: 'Electronics' },
    { id: 2, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 3, name: 'T-Shirt', price: 19.99, category: 'Clothing' },
    { id: 4, name: 'Jeans', price: 49.99, category: 'Clothing' },
    { id: 5, name: 'Garden Chair', price: 89.99, category: 'Home & Garden' },
    { id: 6, name: 'Running Shoes', price: 79.99, category: 'Sports' }
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (content) => {
    setOffer(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOffer(prev => ({
        ...prev,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      offer,
      selectedProducts,
      selectedCategories
    });
    
    setShowSuccess(true);
    
    // Reset form
    setOffer({
      name: '',
      discount: '',
      discountType: 'percentage',
      image: null,
      startDate: '',
      endDate: '',
      description: ''
    });
    setSelectedProducts([]);
    setSelectedCategories([]);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="py-3 bg-light">
        Add new offer
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Offer created successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formOfferName">
                <Form.Label>Offer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={offer.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formThumbnail">
                <Form.Label>Offer Image</Form.Label>
                <Row>
                  <Col md={12}>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Col>
                  <Col md={6}>
                    {offer.image && (
                      <div className="mt-2">
                        <Image src={offer.image} thumbnail style={{ maxWidth: '150px' }} />
                      </div>
                    )}
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="formDiscount">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={offer.discount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formDiscountType">
                <Form.Label>Discount Type</Form.Label>
                <Form.Select
                  name="discountType"
                  value={offer.discountType}
                  onChange={handleChange}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDate"
                  value={offer.startDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDate"
                  value={offer.endDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCategories">
                <Form.Label>Categories</Form.Label>
                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Category Name</th>
                        <th style={{ width: '60px' }}>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>{category.name}</td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => handleCategorySelect(category.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formProducts">
                <Form.Label>Products</Form.Label>
                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th style={{ width: '60px' }}>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={12}>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Editor
                  apiKey="5408gyvhszfkcr6j5bx1tb4fd8pts1ukai6glsrvjxycxrmp"
                  value={offer.description}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  onEditorChange={handleDescriptionChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-4">
              Create Offer
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default OfferForm;