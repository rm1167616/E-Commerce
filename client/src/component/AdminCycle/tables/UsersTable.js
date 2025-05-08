import React from 'react';
import { Table, Form, Button, Dropdown } from 'react-bootstrap';
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
      posts: 6
    },
    {
      id: 2,
      username: 'editor1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      posts: 12
    },
    {
      id: 3,
      username: 'author1',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Author',
      posts: 3
    },
  ];

  return (
    <>
      <div className="flex flex-row mb-3">
        <div className="me-2">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-bulk-actions">
              Bulk actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Delete</Dropdown.Item>
              <Dropdown.Item>Change role</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Button variant="secondary" className="me-2">
          Apply
        </Button>
        <div className="me-2">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-change-role">
              Change role to...
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Administrator</Dropdown.Item>
              <Dropdown.Item>Editor</Dropdown.Item>
              <Dropdown.Item>Author</Dropdown.Item>
              <Dropdown.Item>Subscriber</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Button variant="secondary">
          Change
        </Button>
      </div>

      {/* Search Users Section */}
      <div className="mb-3 p-3 bg-light rounded">
        <h5>Search Users</h5>
        <Form.Control 
          type="text" 
          placeholder="Search users..." 
          className="mb-2"
        />
        <div className="text-muted small">
          1 item
        </div>
      </div>

      {/* Desktop Table */}
      <div className="flex flex-row">
        <Table bordered hover responsive className="product-table d-none d-md-table">
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Username</th>
              <th>Name</th>
              <th>Email </th>
              <th>Role</th>
              <th>Posts</th>
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
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="text-muted small">
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
              <span>View</span>
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