import { Container,Button } from 'react-bootstrap';
import FilterBar from '../FilterBar/FilterBar';
import ProductTable from '../tables/ProductTable';
import CategoriesTable from '../tables/CategoriesTable';
import { Link } from 'react-router-dom';


function Dashboard() {
  return (
    <Container>
        <div className="flex flex-row">
 <Button name="bulk_action" value="Apply" className="filter-button" >
              Add Product
            </Button>
      </div>
    <div className="flex flex-row">
      <FilterBar />
    </div>
    <div className="flex flex-row"
    style={{marginTop:'5%'}}>
      <ProductTable />
    </div>

    </Container>
  );
}

export default Dashboard;