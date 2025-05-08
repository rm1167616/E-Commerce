import { Container,Button } from 'react-bootstrap';
import ProductTable from '../tables/ProductTable';
import { Link } from 'react-router-dom';


function ProductShow() {
  return (
    <Container>
    <div className="flex flex-row">
      <ProductTable />
    </div>
    </Container>
  );
}

export default ProductShow;