import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FiGrid, FiUsers, FiBarChart2, FiBell, FiSettings, FiHome, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const toggleItem = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FiGrid className="nav-icon" />,
      path: '/admin/dashboard',
      subItems: []
    },
    {
      name: 'Products',
      icon: <FiSettings className="nav-icon" />,
      path: '/admin/products',
      subItems: [
        { name: 'All Products', path: '/admin/products/all' },
        { name: 'Add Product', path: '/admin/AddProducts' },
        { name: 'Categories', path: '/admin/products/categories' },
        { name: 'Tags', path: '/admin/products/tags' },
        { name: 'Attributes', path: '/admin/products/attributes' }
      ]
    },
    {
      name: 'Users',
      icon: <FiUsers className="nav-icon" />,
      path: '/admin/users',
      subItems: [
        { name: 'All Users', path: '/admin/users/all' },
        { name: 'Add New', path: '/admin/users/add' }
      ]
    },
    {
      name: 'Reviews',
      icon: <FiBell className="nav-icon" />,
      path: '/admin/reviews',
      subItems: []
    },
    {
      name: 'Settings',
      icon: <FiSettings className="nav-icon" />,
      path: '/admin/settings',
      subItems: [
        { name: 'General', path: '/admin/settings/general' },
        { name: 'Payments', path: '/admin/settings/payments' }
      ]
    },
    {
      name: 'Back To Home',
      icon: <FiHome className="nav-icon" />,
      path: '/',
      subItems: []
    }
  ];

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1>Admin Panel</h1>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <ChevronLeft className={`chevron-icon ${collapsed ? 'rotated' : ''}`} />
        </button>
      </div>

      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-wrapper">
            <Nav.Link 
              as={item.subItems.length > 0 ? 'div' : Link}
              to={item.subItems.length > 0 ? '#' : item.path}
              className={`nav-link dash ${expandedItems[item.name] ? 'active' : ''}`}
              onClick={() => {
                if (item.subItems.length > 0) {
                  toggleItem(item.name);
                }
              }}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.subItems.length > 0 && (
                <span className="dropdown-icon">
                  {expandedItems[item.name] ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              )}
            </Nav.Link>
            
            {item.subItems.length > 0 && (
              <div className={`dropdown-menu ${expandedItems[item.name] ? 'show' : ''}`}>
                {item.subItems.map((subItem, subIndex) => (
                  <Nav.Link 
                    key={subIndex}
                    as={Link} 
                    to={subItem.path} 
                    className="nav-link sub-link"
                  >
                    {subItem.name}
                  </Nav.Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </Nav>
    </nav>
  );
};

export default Sidebar;