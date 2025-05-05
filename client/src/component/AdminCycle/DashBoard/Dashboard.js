import { Container,Button } from 'react-bootstrap';
import FilterBar from '../FilterBar/FilterBar';
import Tables from '../tables/Table';
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
      <Tables />
    </div>
 
    </Container>
  );
}

export default Dashboard;