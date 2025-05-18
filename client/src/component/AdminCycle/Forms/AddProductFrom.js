import React, { useState } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor';
import Categories from './categoriesCheckBox';
import ImageUploadForm from './ImageUploadForm';
import StatusForm from './StatusForm'; // Import the new component
import './Form.css';

const ProductPage = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productStatus, setProductStatus] = useState('draft');
  const [visibility, setVisibility] = useState('public');
  const [isVirtual, setIsVirtual] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);
  const [catalogVisibility, setCatalogVisibility] = useState('shop_and_search');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [description, setDescription] = useState('');

  // Handler for DescriptionEditor
  const handleDescriptionChange = (content) => {
    setDescription(content);
  };

  // Handler for category selection (assuming Categories component can accept a callback)
  const handleCategorySelect = (id) => {
    setCategoryId(id);
  };

  // Handler for attributes (expand as needed)
  const handleAttributesChange = (attrs) => {
    setAttributes(attrs);
  };

  // Handler for multiple image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => setImages(prev => [...prev, ...imgs]));
  };

  // Remove image handler
  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) { e.preventDefault(); }
    // Debug logs for required fields
    console.log('productName:', productName, '| type:', typeof productName);
    console.log('description:', description, '| type:', typeof description);
    console.log('price:', price, '| type:', typeof price);
    console.log('stockQuantity:', stockQuantity, '| type:', typeof stockQuantity);
    console.log('categoryId:', categoryId, '| type:', typeof categoryId);
    console.log('images:', images, '| type:', Array.isArray(images) ? 'array' : typeof images, '| length:', images.length);
    if (!productName) {
      alert('Product name is required.');
      return;
    }
    if (!description) {
      alert('Description is required.');
      return;
    }
    if (!price) {
      alert('Price is required.');
      return;
    }
    if (!stockQuantity) {
      alert('Stock quantity is required.');
      return;
    }
    if (categoryId === null || categoryId === undefined || categoryId === '') {
      alert('Category is required.');
      return;
    }
    if (!Array.isArray(images) || images.length === 0) {
      alert('At least one image is required.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      alert('Price must be a positive number.');
      return;
    }
    if (!Number.isInteger(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      alert('Stock quantity must be a non-negative integer.');
      return;
    }
    // Prepare request body as JSON
    const body = {
      name: productName,
      main_description: description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity),
      category_id: Number(categoryId),
      images,
      attributes
    };

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.status === 201) {
        alert('Product created successfully!');
        // Optionally reset form or redirect
      } else {
        let errorMessage = 'Failed to create product';
        try {
          const errorData = await response.json();
          errorMessage = JSON.stringify(errorData, null, 2) || errorMessage;
        } catch (jsonErr) {
          try {
            const errorText = await response.text();
            errorMessage = errorText;
          } catch (textErr) {
            // fallback to default
          }
        }
        alert('Error: ' + errorMessage);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveDraft = (e) => {
    setProductStatus('draft');
    if (e && e.preventDefault) { e.preventDefault(); }
    handleSubmit(e || { preventDefault: () => {} });
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8}>
          <Card className="mb-12">
            <Card.Header as="h2">Add new product</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><h4>Product name</h4></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    size="lg"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><h4>Price</h4></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    pattern="^\\d*(\\.\\d{0,2})?$"
                    onChange={e => setPrice(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><h4>Stock Quantity</h4></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter stock quantity"
                    value={stockQuantity}
                    min="0"
                    step="1"
                    inputMode="numeric"
                    pattern="^\\d*$"
                    onChange={e => setStockQuantity(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><h4>Description</h4></Form.Label>
                  <DescriptionEditor value={description} onChange={handleDescriptionChange} />
                </Form.Group>
                <Button type="submit" variant="primary">Add Product</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <StatusForm 
            productStatus={productStatus}
            setProductStatus={setProductStatus}
            visibility={visibility}
            setVisibility={setVisibility}
            isVirtual={isVirtual}
            setIsVirtual={setIsVirtual}
            isDownloadable={isDownloadable}
            setIsDownloadable={setIsDownloadable}
            catalogVisibility={catalogVisibility}
            setCatalogVisibility={setCatalogVisibility}
            handleSubmit={handleSubmit}
            handleSaveDraft={handleSaveDraft}
          />
          {/* Move image and category cards here, after status buttons */}
          <div className="d-flex flex-column gap-3">
            <Form.Group className="mb-0">
              <Form.Label><h4>Product Images</h4></Form.Label>
              <ImageUploadForm 
                images={images}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <Card className="mb-4" style={{ minHeight: 260, width: '100%' }}>
                <Card.Header as="h5">Product Categories</Card.Header>
                <Card.Body className="p-2">
                  <Categories onCategorySelect={handleCategorySelect} />
                </Card.Body>
              </Card>
            </Form.Group>
          </div>
        </Col>
        
      </Row>
    </Container>
  );
};

export default ProductPage;