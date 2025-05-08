import { Container,Button } from 'react-bootstrap';

import OffersTable from '../tables/OfferTable';
import { Link } from 'react-router-dom';


function Dashboard() {
  return (
    <Container>
    <div className="flex flex-row"
    style={{marginTop:'5%'}}>
      <OffersTable />
    </div>
    </Container>
  );
}

export default Dashboard;