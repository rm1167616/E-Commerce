import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AddCategoryForm from '../Forms/AddCategoryForm'; // Make sure to import your actual form component
import CategoryTable from '../tables/CategoriesTable'; // Make sure to import your actual table component

const CategoryForm = () => {
  return (
    <Container className="my-4">
      <Row className="g-3">
        <Col>
          <CategoryTable />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryForm;