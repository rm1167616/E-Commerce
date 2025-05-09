import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Alert
} from 'react-bootstrap';

const NavSettingsForm = () => {
  const [settings, setSettings] = useState({
    logo: null,
    logoWidth: '150px',
    logoHeight: '50px',
    isLogoBold: false,
    siteTitle: '',
    titleFontFamily: 'Arial',
    titleFontSize: '24px',
    bgColor: '#ffffff',
    textColor: '#000000'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSettings(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Navigation settings saved:', settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="py-3 bg-light">
        Navigation Settings
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Settings saved successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Site Title Section */}
          <Form.Group className="mb-4" controlId="formSiteTitle">
            <Form.Label>Site Title</Form.Label>
            <Form.Control
              type="text"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
              placeholder="Enter your site name"
              className="mb-3"
            />

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formTitleFontFamily">
                  <Form.Label>Title Font</Form.Label>
                  <Form.Select
                    name="titleFontFamily"
                    value={settings.titleFontFamily}
                    onChange={handleChange}
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formTitleFontSize">
                  <Form.Label>Title Size</Form.Label>
                  <Form.Control
                    type="text"
                    name="titleFontSize"
                    value={settings.titleFontSize}
                    onChange={handleChange}
                    placeholder="24px"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formIsLogoBold" className="pt-4">
                  <Form.Check
                    type="checkbox"
                    name="isLogoBold"
                    label="Bold Title"
                    checked={settings.isLogoBold}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>

          {/* Logo Upload Section */}
          <Form.Group className="mb-4" controlId="formLogo">
            <Form.Label>Logo (PNG with transparent background recommended)</Form.Label>
            <div className="d-flex align-items-center mb-3">
              {logoPreview && (
                <div className="me-3">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    style={{ 
                      width: settings.logoWidth, 
                      height: settings.logoHeight,
                      objectFit: 'contain',
                      backgroundColor: settings.bgColor,
                      padding: '5px'
                    }} 
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Logo Dimensions */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formLogoWidth">
                  <Form.Label>Logo Width</Form.Label>
                  <Form.Control
                    type="text"
                    name="logoWidth"
                    value={settings.logoWidth}
                    onChange={handleChange}
                    placeholder="150px"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLogoHeight">
                  <Form.Label>Logo Height</Form.Label>
                  <Form.Control
                    type="text"
                    name="logoHeight"
                    value={settings.logoHeight}
                    onChange={handleChange}
                    placeholder="50px"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Text className="text-muted">
              Use values like "150px", "50%", or "auto"
            </Form.Text>
          </Form.Group>

          {/* Color Settings */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formBgColor">
                <Form.Label>Background Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="bgColor"
                    value={settings.bgColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="bgColor"
                    value={settings.bgColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formTextColor">
                <Form.Label>Text Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="textColor"
                    value={settings.textColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="textColor"
                    value={settings.textColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Preview Section */}
          <Row className="mb-4">
            <Col>
              <div 
                className="p-3 rounded"
                style={{
                  backgroundColor: settings.bgColor,
                  color: settings.textColor,
                  border: '1px solid #dee2e6'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ 
                          width: settings.logoWidth, 
                          height: settings.logoHeight,
                          objectFit: 'contain',
                          marginRight: '15px'
                        }} 
                      />
                    )}
                    <h5 
                      className="m-0"
                      style={{
                        fontFamily: settings.titleFontFamily,
                        fontSize: settings.titleFontSize,
                        fontWeight: settings.isLogoBold ? 'bold' : 'normal'
                      }}
                    >
                      {settings.siteTitle || 'Your Site Title'}
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-4">
              Save Settings
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NavSettingsForm;