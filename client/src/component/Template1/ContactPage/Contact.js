import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Contact.css'

function Contact() {
  return (
    <>
      <Container 
        className="my-5 p-4 rounded contact-support-container"
        onMouseEnter={(e) => {
          e.currentTarget.classList.add('contact-support-container-hover');
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove('contact-support-container-hover');
        }}
      >
        <Row className="justify-content-center">
          <Col md={8} className="text-center mb-4">
            <h2 className="contact-support-title">Contact Support</h2>
            <p className="lead contact-support-subtitle">We're here to help you with any questions or issues</p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={6} className="mb-4">
            <div 
              className="p-4 rounded contact-info-card"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('contact-info-card-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('contact-info-card-hover');
              }}
            >
              <h4 className="mb-3">Support Information</h4>
              <p>
                <strong>Email:</strong> strategystarsads@gmail.com<br />
                <strong>Phone:</strong> 
                <a href="tel:+201113337724"> +20 111 333 7724</a>, 
                <a href="tel:+201112221449"> +20 111 222 1449</a><br />
                <strong>Address:</strong> 
                <a 
                  href="https://maps.google.com/?q=Almaza Street from Thawra Street - Heliopolis, Cairo, Egypt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Almaza Street from Thawra Street - Heliopolis, Cairo, Egypt
                </a><br />
                <strong>Hours:</strong> Monday-Friday, 9AM-5PM
              </p>
              <p>
                For immediate assistance, please use the contact form or call us directly.
              </p>
            </div>
          </Col>
          
          <Col md={6}>
            <div 
              className="p-4 rounded contact-form-card"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('contact-form-card-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('contact-form-card-hover');
              }}
            >
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="contact-form-label">Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your name" 
                    className="contact-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="contact-form-label">Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    className="contact-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="contact-form-label">Subject</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="What's this about?" 
                    className="contact-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="contact-form-label">Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    placeholder="Describe your issue in detail" 
                    className="contact-form-control"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="contact-submit-btn"
                  >
                    Submit Request
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>

        <Row className="mt-5 justify-content-center">
          <Col md={8} className="text-center">
            <h4 className="mb-3 contact-faq-title">Frequently Asked Questions</h4>
            <div className="text-start">
              <h5 className="contact-faq-question">How do I reset my password?</h5>
              <p>Go to the login page and click "Forgot Password" to receive reset instructions via email.</p>
              
              <h5 className="contact-faq-question">Where can I find my order history?</h5>
              <p>Log in to your account and navigate to the "My Orders" section in your dashboard.</p>
              
              <h5 className="contact-faq-question">What's your return policy?</h5>
              <p>We accept returns within 30 days of purchase with original receipt. See our Returns page for details.</p>
            </div>
          </Col>
        </Row>
      </Container> 
    </>
  )
}

export default Contact;