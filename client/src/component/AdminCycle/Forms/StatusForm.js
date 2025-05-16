import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import './Form.css';

const StatusForm = ({
  handleSubmit,
  handleSaveDraft
}) => {
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Status</Card.Header>
      <Card.Body>
        <Form>
          <div className="d-grid gap-2 mb-3">
            <Button 
              variant="outline-secondary" 
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button variant="outline-secondary">Preview</Button>
            <Button 
              variant="outline-primary" 
              onClick={handleSubmit}
            >
              Publish
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StatusForm;