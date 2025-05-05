import { Container } from 'react-bootstrap';
import FilterBar from '../FilterBar/FilterBar';
import Tables from '../tables/Table';

function Dashboard() {
  return (
    <Container>
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