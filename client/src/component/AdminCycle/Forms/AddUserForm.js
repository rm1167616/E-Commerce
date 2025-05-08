import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Alert
} from 'react-bootstrap';

const AddUserForm = () => {
  const [user, setUser] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    password: '',
    role: 'subscriber',
    sendNotification: true
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const roles = [
    { value: 'subscriber', label: 'Subscriber' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'author', label: 'Author' },
    { value: 'contributor', label: 'Contributor' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUser(prev => ({ ...prev, password }));
    setGeneratedPassword(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('User created:', user);
    
    setShowSuccess(true);
    
    // Reset form
    setUser({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      website: '',
      password: '',
      role: 'subscriber',
      sendNotification: true
    });
    setGeneratedPassword('');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="py-3 bg-light">
        Add New User
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            User created successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username (required)</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <div className="d-flex align-items-center mb-2">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={generatePassword}
                className="me-2"
              >
                Generate password
              </Button>
              {user.password && (
                <span className={user.password.length > 8 ? 'text-success' : 'text-warning'}>
                  {user.password.length > 8 ? 'Strong' : 'Weak'}
                </span>
              )}
            </div>
            <Form.Control
              type="text"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNotification">
            <Form.Check
              type="checkbox"
              name="sendNotification"
              label="Send User Notification"
              checked={user.sendNotification}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Send the new user an email about their account
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={user.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-4">
              Add User
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddUserForm;