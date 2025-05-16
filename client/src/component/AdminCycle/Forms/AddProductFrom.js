import React, { useState } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
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
  const [productImage, setProductImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      productName,
      productDescription,
      productStatus,
      visibility,
      isVirtual,
      isDownloadable,
      catalogVisibility,
      productImage,
      galleryImages
    });
  };

  const handleSaveDraft = () => {
    setProductStatus('draft');
    handleSubmit(new Event('submit')); // Simulate form submission
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
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
                <DescriptionEditor />
                <hr className="my-4" />
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
          
          <ImageUploadForm 
            productImage={productImage} 
            handleImageUpload={handleImageUpload} 
          />
        </Col>
        <Col md={12} style={{marginTop:'-12%'}}>
        <Categories /> 
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;