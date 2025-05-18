import React from 'react';
import { Card, Form, Image, Button } from 'react-bootstrap';
import './Form.css';

const ImageUploadForm = ({ images, handleImageUpload, handleRemoveImage }) => {
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Product Images</Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Control 
            type="file" 
            accept="image/*" 
            multiple
            onChange={handleImageUpload} 
          />
        </Form.Group>
        {images && images.length > 0 ? (
          <div className="d-flex flex-wrap mb-3 gap-2 mt-3">
            {images.map((img, idx) => {
              const src = img instanceof File ? URL.createObjectURL(img) : img;
              return (
                <div key={idx} className="position-relative me-2 mb-2">
                  <Image src={src} thumbnail style={{ maxHeight: '100px', maxWidth: '100px' }} />
                  <Button variant="danger" size="sm" className="position-absolute top-0 end-0" style={{zIndex:2}} onClick={() => handleRemoveImage(idx)}>&times;</Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border p-5 text-center mb-3">
            <div>No images uploaded</div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ImageUploadForm;