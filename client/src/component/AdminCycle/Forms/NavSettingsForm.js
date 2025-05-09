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

const NavSettingsForm = () => {
  const defaultSettings = {
    logo: null,
    logoWidth: '150px',
    logoHeight: '50px',
    isLogoBold: false,
    siteTitle: '',
    titleFontFamily: 'Arial',
    titleFontSize: '24px',
    titleTextAlign: 'left',
    bgColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#dee2e6',
    borderRadius: '0px',
    menuItems: ['Home', 'About Us', 'Contact Us'],
    menuFontFamily: 'Arial',
    menuFontSize: '16px',
    isMenuBold: false,
    menuTextAlign: 'center',
    logoTitleGap: '15px',
    menuItemGap: '20px',
    navPadding: '10px'
  };

  const [settings, setSettings] = useState(defaultSettings);
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

  const textAlignOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validate font size if it's a font size field
    if ((name === 'titleFontSize' || name === 'menuFontSize') && value) {
      const sizeValue = parseInt(value);
      if (isNaN(sizeValue) || sizeValue < 8 || sizeValue > 72) {
        return; // Don't update if invalid
      }
    }
    
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

  const resetToDefault = () => {
    setSettings(defaultSettings);
    setLogoPreview(null);
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
              <Col md={3}>
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
              <Col md={3}>
                <Form.Group controlId="formTitleFontSize">
                  <Form.Label>Title Size (8-72px)</Form.Label>
                  <Form.Control
                    type="number"
                    name="titleFontSize"
                    value={parseInt(settings.titleFontSize) || 24}
                    onChange={handleChange}
                    min="8"
                    max="72"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formTitleTextAlign">
                  <Form.Label>Title Alignment</Form.Label>
                  <Form.Select
                    name="titleTextAlign"
                    value={settings.titleTextAlign}
                    onChange={handleChange}
                  >
                    {textAlignOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
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

          {/* Menu Items Styling Section */}
          <Form.Group className="mb-4">
            <h5 className="mb-3">Menu Items Styling</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="formMenuFontFamily">
                  <Form.Label>Menu Font</Form.Label>
                  <Form.Select
                    name="menuFontFamily"
                    value={settings.menuFontFamily}
                    onChange={handleChange}
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formMenuFontSize">
                  <Form.Label>Menu Size (8-72px)</Form.Label>
                  <Form.Control
                    type="number"
                    name="menuFontSize"
                    value={parseInt(settings.menuFontSize) || 16}
                    onChange={handleChange}
                    min="8"
                    max="72"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formMenuTextAlign">
                  <Form.Label>Menu Alignment</Form.Label>
                  <Form.Select
                    name="menuTextAlign"
                    value={settings.menuTextAlign}
                    onChange={handleChange}
                  >
                    {textAlignOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formIsMenuBold" className="pt-4">
                  <Form.Check
                    type="checkbox"
                    name="isMenuBold"
                    label="Bold Menu"
                    checked={settings.isMenuBold}
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
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group controlId="formLogoTitleGap">
                  <Form.Label>Logo-Title Gap</Form.Label>
                  <Form.Control
                    type="text"
                    name="logoTitleGap"
                    value={settings.logoTitleGap}
                    onChange={handleChange}
                    placeholder="15px"
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
            <Col md={4}>
              <Form.Group controlId="formBorderColor">
                <Form.Label>Border Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="borderColor"
                    value={settings.borderColor}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px', padding: '3px' }}
                  />
                  
                  <Form.Control
                    type="text"
                    name="borderColor"
                    value={settings.borderColor}
                    onChange={handleChange}
                    className="ms-2"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Navigation Style Settings */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="formBorderRadius">
                <Form.Label>Border Radius</Form.Label>
                <Form.Control
                  type="text"
                  name="borderRadius"
                  value={settings.borderRadius}
                  onChange={handleChange}
                  placeholder="0px"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formMenuItemGap">
                <Form.Label>Menu Item Gap</Form.Label>
                <Form.Control
                  type="text"
                  name="menuItemGap"
                  value={settings.menuItemGap}
                  onChange={handleChange}
                  placeholder="20px"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formNavPadding">
                <Form.Label>Navigation Padding</Form.Label>
                <Form.Control
                  type="text"
                  name="navPadding"
                  value={settings.navPadding}
                  onChange={handleChange}
                  placeholder="10px"
                />
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
                  border: `1px solid ${settings.borderColor}`,
                  borderRadius: settings.borderRadius,
                  padding: settings.navPadding
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div 
                    className="d-flex align-items-center"
                    style={{
                      justifyContent: settings.titleTextAlign === 'center' ? 'center' : 
                                      settings.titleTextAlign === 'right' ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        style={{ 
                          width: settings.logoWidth, 
                          height: settings.logoHeight,
                          objectFit: 'contain',
                          marginRight: settings.logoTitleGap
                        }} 
                      />
                    )}
                    <h5 
                      className="m-0"
                      style={{
                        fontFamily: settings.titleFontFamily,
                        fontSize: `${settings.titleFontSize}px`,
                        fontWeight: settings.isLogoBold ? 'bold' : 'normal',
                        textAlign: settings.titleTextAlign
                      }}
                    >
                      {settings.siteTitle || 'Your Site Title'}
                    </h5>
                  </div>
                  
                  {/* Menu Items */}
                  <div 
                    style={{
                      display: 'flex',
                      gap: settings.menuItemGap,
                      justifyContent: settings.menuTextAlign === 'center' ? 'center' : 
                                        settings.menuTextAlign === 'right' ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    {settings.menuItems.map((item, index) => (
                      <span 
                        key={index}
                        style={{
                          cursor: 'pointer',
                          padding: '5px 10px',
                          transition: 'all 0.3s ease',
                          fontFamily: settings.menuFontFamily,
                          fontSize: `${settings.menuFontSize}px`,
                          fontWeight: settings.isMenuBold ? 'bold' : 'normal'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
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

export default NavSettingsForm;