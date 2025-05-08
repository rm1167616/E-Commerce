import React from 'react';
import { Card, Form, Image } from 'react-bootstrap';

const ImageUploadForm = ({ productImage, handleImageUpload }) => {
    
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Product Image</Card.Header>
      <Card.Body>
        <Form>
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
            <Form.Control 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ImageUploadForm;