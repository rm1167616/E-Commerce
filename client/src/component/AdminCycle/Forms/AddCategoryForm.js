import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  FormControl, 
  FormLabel, 
  FormSelect,
  Image,
  Alert,
  Table
} from 'react-bootstrap';

const CategoryForm = ({ categoryId, action, actionCategory }) => {
  const [category, setCategory] = useState({
    name: '',
    slug: '',
    parentCategory: 'none',
    description: '',
    thumbnail: null,
    productCount: 0
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', parent: 'none', productCount: 42 },
    { id: 2, name: 'Clothing', parent: 'none', productCount: 36 },
    { id: 3, name: 'Men', parent: 'Clothing', productCount: 18 },
    { id: 4, name: 'Women', parent: 'Clothing', productCount: 18 }
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: 'T-Shirt', price: 19.99 },
    { id: 2, name: 'Jeans', price: 49.99 },
    { id: 3, name: 'Sneakers', price: 79.99 },
    { id: 4, name: 'Hat', price: 14.99 },
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) { return; }
    setLoading(true);
    setError(null);
    fetch(`/api/admin/categories/${categoryId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to fetch category');
        }
        return res.json();
      })
      .then(data => {
        setCategory({
          name: data.name || '',
          slug: data.slug || '',
          parentCategory: data.parent || 'none',
          description: data.description || '',
          thumbnail: data.thumbnail || null,
          productCount: data.productCount || 0
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  useEffect(() => {
    if (action) {
      if (action === 'add') {
        alert('Add Category action triggered!');
      } else if (actionCategory) {
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} action for category: ${actionCategory.name} (ID: ${actionCategory.id})`);
      }
    }
  }, [action, actionCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (content) => {
    setCategory(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory(prev => ({
        ...prev,
        thumbnail: URL.createObjectURL(file)
      }));
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = {
        name: category.name,
        description: category.description,
        parent: category.parentCategory === 'none' ? null : category.parentCategory,
        // Add other fields as needed
      };
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to create category');
      }
      setShowSuccess(true);
      // Reset form
      setCategory({
        name: '',
        slug: '',
        parentCategory: 'none',
        description: '',
        thumbnail: null,
        productCount: 0
      });
      setSelectedProducts([]);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parentCategories = categories.filter(cat => cat.parent === 'none');

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="py-3 bg-light">
        {categoryId ? 'Edit category' : 'Add new category'}
      </Card.Header>
      <Card.Body>
        {loading && <Alert variant="info">Loading category...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {showSuccess && (
          <Alert variant="primary" onClose={() => setShowSuccess(false)} dismissible>
            Category created successfully with {selectedProducts.length} products!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Name</Form.Label>
                <Form.Text className="text-muted d-block mb-2">
                  The name is how it appears on your site.
                </Form.Text>
                <Form.Control
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group controlId="formThumbnail">
                <Form.Label>Upload Image</Form.Label>
                <Form.Text className="text-muted d-block mb-2">
                  Upload an image for this category.
                </Form.Text>
                <Row>
                  <Col md={12}>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Col>
                  <Col md={6}>
                    {category.thumbnail && (
                      <div className="mt-2">
                        <Image src={category.thumbnail} thumbnail style={{ maxWidth: '150px' }} />
                      </div>
                    )}
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formParentCategory">
                <Form.Label>Parent category</Form.Label>
                <Form.Text className="text-muted d-block mb-2">
                  Assign a parent term to create a hierarchy.
                </Form.Text>
                <Form.Select
                  name="parentCategory"
                  value={category.parentCategory}
                  onChange={handleChange}
                  className="mb-3"
                >
                  <option value="none">None</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group controlId="formProducts">
                <Form.Label>Products in this category</Form.Label>
                <div className="table-responsive">
                  <Table bordered hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Product Name</th>
                        <th style={{ width: '60px' }}>Add</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Description and Products Table Side by Side */}
            <Col lg={12} className="mb-3 mb-lg-0">
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Text className="text-muted d-block mb-2">
                  The description is not prominent by default; however, some themes may show it.
                </Form.Text>
                <Editor
                  apiKey="5408gyvhszfkcr6j5bx1tb4fd8pts1ukai6glsrvjxycxrmp"
                  value={category.description}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  onEditorChange={handleDescriptionChange}
                />
              </Form.Group>
            </Col>

            <Col lg={6}>
              
            </Col>
          </Row>

          

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-4">
              Add Category
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CategoryForm;