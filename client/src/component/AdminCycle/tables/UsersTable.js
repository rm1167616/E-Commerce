import React from 'react';
import { Table, Form, Button, Dropdown, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Table.css';

const UsersTable = () => {
  // Sample user data - replace with your actual data
  const users = [
    {
      id: 1,
      username: 'admin',
      name: 'Toqa Osama',
      email: 'toqaosama86@gmail.com',
      role: 'Administrator',
      posts: 6,
      actionHistory: [
        { date: '2023-05-15', action: 'Role changed to Administrator' },
        { date: '2023-04-10', action: 'Password reset' }
      ]
    },
    {
      id: 2,
      username: 'editor1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      posts: 12,
      actionHistory: [
        { date: '2023-05-10', action: 'Role changed to Editor' },
        { date: '2023-03-22', action: 'Account created' }
      ]
    },
    {
      id: 3,
      username: 'author1',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Author',
      posts: 3,
      actionHistory: [
        { date: '2023-05-05', action: 'Role changed to Author' },
        { date: '2023-02-18', action: 'Profile updated' }
      ]
    },
  ];

  const bulkActions = [
    { value: '', label: 'Bulk actions', selected: true },
    { value: 'delete', label: 'Delete' },
    { value: 'change_role', label: 'Change role' }
  ];

  const userRoles = [
    { value: '', label: 'Change role to...', selected: true },
    { value: 'administrator', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'author', label: 'Author' },
    { value: 'subscriber', label: 'Subscriber' }
  ];

  const renderOptions = (options) => {
    return options.map((option) => (
      <option 
        key={option.value} 
        value={option.value}
        selected={option.selected}
      >
        {option.label}
      </option>
    ));
  };

  const renderActionHistory = (history) => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="link" id="dropdown-action-history" className='history'>
          View History
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {history.map((item, index) => (
            <Dropdown.Item key={index}>
              <div className="small">{item.date}</div>
              <div>{item.action}</div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <>
      <div className="filter-bar-container mb-3 p-3 bg-light rounded">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="filter-actions-container" style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Select name="bulk_action" className="filter-select me-2">
                {renderOptions(bulkActions)}
              </Form.Select>
              
              <Button name="apply_bulk_action" value="Apply" className="filter-button me-2">
                Apply
              </Button>

              <Form.Select name="new_role" className="filter-select me-2">
                {renderOptions(userRoles)}
              </Form.Select>
              
              <Button name="change_role_action" value="Change" className="filter-button me-2">
                Change
              </Button>
            </div>
          </Col>
          
          <Col md={4}>
            <div className="search-container">
              <h5>Search Users</h5>
              <Form.Control 
                type="text" 
                placeholder="Search users..." 
              />
              <div className="text-muted small mt-1">
                1 item
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Desktop Table */}
      <div className="flex flex-row" style={{marginTop:'7%'}}>
        <Table bordered hover responsive className="product-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Posts</th>
              <th>Action History</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="product-row">
                <td><Form.Check type="checkbox" /></td>
                <td>
                  <Link to="/" className="product-link">
                    <strong style={{ color: '#1e73be' }}>{user.username}</strong>
                  </Link>
                  <div className="hover-actions">
                    ID: {user.id} | <span className="text-primary">Edit</span> | <span className="text-danger">Delete</span> | View 
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.posts}</td>
                <td>
                  {renderActionHistory(user.actionHistory)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="7" className="text-muted small">
                WordPress.com account [?] | {users.length} items
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="d-md-none mobile-product-list">
        {users.map(user => (
          <div key={user.id} className="mobile-product-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong style={{ color: '#1e73be' }}>{user.username}</strong>
              </div>
              <div>
                <span className="badge bg-secondary">{user.role}</span>
              </div>
            </div>
            <div className="text-muted small mt-2">
              Name: {user.name}
            </div>
            <div className="mt-2">
              Email: {user.email}
            </div>
            <div className="d-flex justify-content-between small mt-2">
              <span>Posts: {user.posts}</span>
            </div>
            <div className="mt-2">
              <span className="text-primary me-2">Edit</span>
              <span className="text-danger me-2">Delete</span>
              <span className="me-2">View</span>
              <Dropdown>
                <Dropdown.Toggle variant="link" size="sm" id="dropdown-mobile-history">
                  History
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user.actionHistory.map((item, index) => (
                    <Dropdown.Item key={index}>
                      <div className="small">{item.date}</div>
                      <div>{item.action}</div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ))}
        <div className="text-muted small mt-2">
          WordPress.com account [?] | {users.length} items
        </div>
      </div>
    </>
  );
};

export default UsersTable;