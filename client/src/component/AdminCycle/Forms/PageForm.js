import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col,
  Alert
} from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';

const PageSettingsForm = () => {
  const defaultSettings = {
    bgColor: '#ffffff',
    primaryTextColor: '#000000',
    secondaryTextColor: '#6c757d',
    headingFontFamily: 'Arial',
    headingFontSize: '24',
    paragraphFontFamily: 'Arial',
    paragraphFontSize: '16',
    linkColor: '#007bff',
    linkHoverColor: '#0056b3',
    pagePadding: '20px',
    contentMaxWidth: '1200px'
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [showSuccess, setShowSuccess] = useState(false);

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
    
    // Validate font sizes
    if (name.includes('FontSize')) {
      const sizeValue = parseInt(value);
      if (isNaN(sizeValue)) return;
      if (sizeValue < 8 || sizeValue > 72) return;
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page settings saved:', settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header as="h5" className="py-3 bg-light">
        Page Style Settings
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Settings saved successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Color Settings */}
          <Row className="mb-4">
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group controlId="formPrimaryTextColor">
                <Form.Label>Primary Text Color (Headings)</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="primaryTextColor"
                    value={settings.primaryTextColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="primaryTextColor"
                    value={settings.primaryTextColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formSecondaryTextColor">
                <Form.Label>Secondary Text Color (Paragraphs)</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="secondaryTextColor"
                    value={settings.secondaryTextColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="secondaryTextColor"
                    value={settings.secondaryTextColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Link Colors */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formLinkColor">
                <Form.Label>Link Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="linkColor"
                    value={settings.linkColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="linkColor"
                    value={settings.linkColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLinkHoverColor">
                <Form.Label>Link Hover Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="linkHoverColor"
                    value={settings.linkHoverColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  <Form.Control
                    type="text"
                    name="linkHoverColor"
                    value={settings.linkHoverColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Font Settings */}
          <Row className="mb-4">
            <Col md={6}>
              <h5 className="mb-3">Heading Styles</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formHeadingFontFamily">
                    <Form.Label>Heading Font</Form.Label>
                    <Form.Select
                      name="headingFontFamily"
                      value={settings.headingFontFamily}
                      onChange={handleChange}
                    >
                      {fontFamilies.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formHeadingFontSize">
                    <Form.Label>Heading Size (8-72px)</Form.Label>
                    <Form.Control
                      type="number"
                      name="headingFontSize"
                      value={settings.headingFontSize}
                      onChange={handleChange}
                      min="8"
                      max="72"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <h5 className="mb-3">Paragraph Styles</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formParagraphFontFamily">
                    <Form.Label>Paragraph Font</Form.Label>
                    <Form.Select
                      name="paragraphFontFamily"
                      value={settings.paragraphFontFamily}
                      onChange={handleChange}
                    >
                      {fontFamilies.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formParagraphFontSize">
                    <Form.Label>Paragraph Size (8-72px)</Form.Label>
                    <Form.Control
                      type="number"
                      name="paragraphFontSize"
                      value={settings.paragraphFontSize}
                      onChange={handleChange}
                      min="8"
                      max="72"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Layout Settings */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formPagePadding">
                <Form.Label>Page Padding</Form.Label>
                <Form.Control
                  type="text"
                  name="pagePadding"
                  value={settings.pagePadding}
                  onChange={handleChange}
                  placeholder="20px"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formContentMaxWidth">
                <Form.Label>Content Max Width</Form.Label>
                <Form.Control
                  type="text"
                  name="contentMaxWidth"
                  value={settings.contentMaxWidth}
                  onChange={handleChange}
                  placeholder="1200px"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Preview Section */}
          <Row className="mb-4">
            <Col>
              <div 
                className="p-4 rounded"
                style={{
                  backgroundColor: settings.bgColor,
                  maxWidth: settings.contentMaxWidth,
                  margin: '0 auto',
                  padding: settings.pagePadding
                }}
              >
                <h1 
                  style={{
                    fontFamily: settings.headingFontFamily,
                    fontSize: `${settings.headingFontSize}px`,
                    color: settings.primaryTextColor,
                    marginBottom: '20px'
                  }}
                >
                  Page Heading Example
                </h1>
                <p 
                  style={{
                    fontFamily: settings.paragraphFontFamily,
                    fontSize: `${settings.paragraphFontSize}px`,
                    color: settings.secondaryTextColor,
                    marginBottom: '20px'
                  }}
                >
                  This is an example paragraph text demonstrating the secondary text color and paragraph font settings. The quick brown fox jumps over the lazy dog.
                </p>
                <a 
                  href="#"
                  style={{
                    color: settings.linkColor,
                    textDecoration: 'none',
                    fontFamily: settings.paragraphFontFamily,
                    fontSize: `${settings.paragraphFontSize}px`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.linkHoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = settings.linkColor}
                >
                  Example link - hover to see the effect
                </a>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={resetToDefault}
              className="d-flex align-items-center gap-1"
            >
              <ArrowCounterclockwise size={16} />
              Reset to Default
            </Button>
            <Button variant="primary" type="submit" className="px-4">
              Save Settings
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PageSettingsForm;