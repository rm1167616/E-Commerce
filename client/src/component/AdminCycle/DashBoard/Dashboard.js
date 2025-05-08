import { Container,Button } from 'react-bootstrap';
import FilterBar from '../FilterBar/FilterBar';
import ProductTable from '../tables/ProductTable';
import CategoryForm from '../Forms/CategoryForm';
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
    <div className="flex flex-row"
    style={{marginTop:'5%'}}>
      <CategoryForm />
    </div>
    </Container>
  );
}

export default Dashboard;