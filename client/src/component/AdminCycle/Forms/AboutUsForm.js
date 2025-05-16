import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Alert,
  Image
} from 'react-bootstrap';
import { ArrowCounterclockwise, PlusCircle, Trash } from 'react-bootstrap-icons';
import './Form.css';

const ContactUsForm = () => {
  const defaultSection = {
    title: '',
    content: '',
    image: null,
    imagePreview: null
  };

  const [sections, setSections] = useState([{...defaultSection}]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    updatedSections[index][name] = value;
    setSections(updatedSections);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedSections = [...sections];
    
    // Remove previous image if exists
    if (updatedSections[index].image) {
      URL.revokeObjectURL(updatedSections[index].imagePreview);
    }

    updatedSections[index].image = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedSections[index].imagePreview = reader.result;
      setSections(updatedSections);
    };
    reader.readAsDataURL(file);
  };

  const addSection = () => {
    setSections([...sections, {...defaultSection}]);
  };

  const removeSection = (index) => {
    if (sections.length <= 1) return; // Keep at least one section
    
    // Clean up image URL if exists
    if (sections[index].imagePreview) {
      URL.revokeObjectURL(sections[index].imagePreview);
    }
    
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const resetForm = () => {
    // Clean up all image URLs
    sections.forEach(section => {
      if (section.imagePreview) {
        URL.revokeObjectURL(section.imagePreview);
      }
    });
    setSections([{...defaultSection}]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Us sections saved:', sections);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header as="h5" className="py-3 bg-light">
        Contact Us Page Content
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Contact Us content saved successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {sections.map((section, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Section {index + 1}</h5>
                {sections.length > 1 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeSection(index)}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>

              <Form.Group className="mb-3" controlId={`formTitle-${index}`}>
                <Form.Label>Section Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={section.title}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter section title"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId={`formContent-${index}`}>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="content"
                  value={section.content}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter section content"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId={`formImage-${index}`}>
                <Form.Label>Image (Optional)</Form.Label>
                <div className="d-flex align-items-center">
                  {section.imagePreview ? (
                    <div className="me-3">
                      <Image 
                        src={section.imagePreview} 
                        thumbnail 
                        style={{ maxWidth: '100px', maxHeight: '100px' }} 
                      />
                    </div>
                  ) : (
                    <div className="me-3 text-muted">No image selected</div>
                  )}
                  <div>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="mb-2"
                    />
                    <Form.Text className="text-muted">
                      {section.image ? section.image.name : 'JPEG or PNG recommended'}
                    </Form.Text>
                  </div>
                </div>
              </Form.Group>
            </div>
          ))}

          <div className="d-flex justify-content-between mb-4">
            <Button 
              variant="outline-primary" 
              onClick={addSection}
              className="d-flex align-items-center gap-1"
            >
              <PlusCircle size={16} />
              Add Section
            </Button>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={resetForm}
              className="d-flex align-items-center gap-1"
            >
              <ArrowCounterclockwise size={16} />
              Reset Form
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              Save Content
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContactUsForm;