import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionEditor from '../DescriptionEditor/DescriptionEditor'

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

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(file => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        setGalleryImages([...galleryImages, ...results]);
      });
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
          <Card className="mb-4">
            <Card.Header as="h5">Publish</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2 mb-3">
                <Button variant="outline-secondary">Save Draft</Button>
                <Button variant="outline-secondary">Preview</Button>
                <Button variant="outline-primary">Publish</Button>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Status: <strong>{productStatus}</strong></Form.Label>
                <Form.Select
                  value={productStatus}
                  onChange={(e) => setProductStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Visibility: <strong>{visibility}</strong></Form.Label>
                <Form.Select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Publish immediately</Form.Label>
                <Form.Control type="datetime-local" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Catalog visibility: <strong>{catalogVisibility.replace('_', ' ')}</strong></Form.Label>
                <Form.Select
                  value={catalogVisibility}
                  onChange={(e) => setCatalogVisibility(e.target.value)}
                >
                  <option value="shop_and_search">Shop and search results</option>
                  <option value="shop_only">Shop only</option>
                  <option value="search_only">Search only</option>
                  <option value="hidden">Hidden</option>
                </Form.Select>
              </Form.Group>

              <Button variant="outline-secondary" size="sm">
                Copy to a new draft
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">Product Image</Card.Header>
            <Card.Body>
              {productImage ? (
                <div className="text-center mb-3">
                  <Image src={productImage} thumbnail style={{ maxHeight: '150px' }} />
                </div>
              ) : (
                <div className="border p-5 text-center mb-3">
                  <div>Set product image</div>
                </div>
              )}
              <Form.Group>
                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              </Form.Group>
             
            </Card.Body>
          </Card>

        
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;