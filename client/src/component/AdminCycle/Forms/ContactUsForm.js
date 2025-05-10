import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Alert
} from 'react-bootstrap';
import { ArrowCounterclockwise, Send } from 'react-bootstrap-icons';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: 'strategystarsads@gmail.com',
    phone: '+20 111 333 7724, +20 111 222 1449',
    address: 'Almaza Street from Thawra Street - Heliopolis, Cairo, Egypt',
    hours: 'Monday-Friday, 9AM-5PM',
    adminEmail: 'strategystarsads@gmail.com'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.hours.trim()) {
      newErrors.hours = 'Working hours are required';
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid admin email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error('Failed to update contact information');
      }
    } catch (error) {
      setErrors({
        ...errors,
        submit: 'There was an error updating the information. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: 'strategystarsads@gmail.com',
      phone: '+20 111 333 7724, +20 111 222 1449',
      address: 'Almaza Street from Thawra Street - Heliopolis, Cairo, Egypt',
      hours: 'Monday-Friday, 9AM-5PM',
      adminEmail: 'strategystarsads@gmail.com'
    });
    setErrors({});
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header as="h5" className="py-3 bg-light">
        Update Contact Information
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Contact information updated successfully!
          </Alert>
        )}

        {errors.submit && (
          <Alert variant="danger" onClose={() => setErrors({...errors, submit: null})} dismissible>
            {errors.submit}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Numbers</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone numbers"
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Separate multiple numbers with commas
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formHours">
            <Form.Label>Working Hours</Form.Label>
            <Form.Control
              type="text"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              placeholder="Enter working hours"
              isInvalid={!!errors.hours}
            />
            <Form.Control.Feedback type="invalid">
              {errors.hours}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Example: Monday-Friday, 9AM-5PM
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAdminEmail">
            <Form.Label>Admin Email Address</Form.Label>
            <Form.Control
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Enter admin email"
              isInvalid={!!errors.adminEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.adminEmail}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              This is the email address that will receive contact form messages
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={resetForm}
              className="d-flex align-items-center gap-1"
              disabled={isSubmitting}
            >
              <ArrowCounterclockwise size={16} />
              Reset
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="px-4 d-flex align-items-center gap-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : (
                <>
                  <Send size={16} />
                  Update Information
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ContactForm;