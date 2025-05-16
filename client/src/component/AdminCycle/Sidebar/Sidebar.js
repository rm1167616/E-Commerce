import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import {
  FiGrid, FiUsers, FiBell, FiSettings, FiHome, FiChevronDown, FiChevronRight,
  FiBox, FiTag, FiUserCheck, FiFileText, FiMail, FiTruck, FiStar, FiUserPlus, FiPlusCircle, FiList, FiLayers
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const toggleItem = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FiGrid className="nav-icon" />,
      path: '/admin/dashboard',
      subItems: []
    },
    {
      name: 'Products',
      icon: <FiBox className="nav-icon" />,
      path: '/admin/products',
      subItems: [
        { name: 'All Products', path: '/admin/ProductShow', icon: <FiList className="sub-nav-icon" /> },
        { name: 'Add Product', path: '/admin/AddProducts', icon: <FiPlusCircle className="sub-nav-icon" /> },
        { name: 'Categories', path: '/admin/CategoryForm', icon: <FiLayers className="sub-nav-icon" /> },
      ]
    },
    {
      name: 'Categories',
      icon: <FiTag className="nav-icon" />,
      path: '/admin/users',
      subItems: [
        { name: 'All Categories', path: '/admin/CategoryForm', icon: <FiList className="sub-nav-icon" /> },
        { name: 'Add Categories', path: '/admin/AddCategory', icon: <FiPlusCircle className="sub-nav-icon" /> }
      ]
    },
    {
      name: 'Offer',
      icon: <FiTag className="nav-icon" />,
      path: '/admin/users',
      subItems: [
        { name: 'All Offers', path: '/admin/OfferTable', icon: <FiList className="sub-nav-icon" /> },
        { name: 'Add Offer', path: '/admin/AddOffer', icon: <FiPlusCircle className="sub-nav-icon" /> }
      ]
    },
    {
      name: 'Users',
      icon: <FiUsers className="nav-icon" />,
      path: '/admin/users',
      subItems: [
        { name: 'All Users', path: '/admin/UsersTable', icon: <FiUserCheck className="sub-nav-icon" /> },
        { name: 'Add User', path: '/admin/AddUserForm', icon: <FiUserPlus className="sub-nav-icon" /> }
      ]
    },
    {
      name: 'Header Setting',
      icon: <FiSettings className="nav-icon" />,
      path: '/admin/NavSettingsForm',
      subItems: []
    },
    {
      name: 'Pages Setting',
      icon: <FiFileText className="nav-icon" />,
      path: '/admin/users',
      subItems: [
        { name: 'All Pages', path: '/admin/PagesManagement', icon: <FiList className="sub-nav-icon" /> },
        { name: 'Pages Setting', path: '/admin/PageSettingsForm', icon: <FiSettings className="sub-nav-icon" /> },
        { name: 'About US', path: '/admin/AboutUsForm', icon: <FiFileText className="sub-nav-icon" /> },
        { name: 'Contact US', path: '/admin/ContactForm', icon: <FiMail className="sub-nav-icon" /> },
      ]
    },
    {
      name: 'Reviews',
      icon: <FiStar className="nav-icon" />,
      path: '/admin/ReviewsTable',
      subItems: []
    },
    {
      name: 'Shipping',
      icon: <FiTruck className="nav-icon" />,
      path: '/admin/Shipping',
      subItems: []
    },
    {
      name: 'Settings',
      icon: <FiSettings className="nav-icon" />,
      path: '/admin/settings',
      subItems: [
        { name: 'General', path: '/admin/settings/general', icon: <FiSettings className="sub-nav-icon" /> },
        { name: 'Payments', path: '/admin/settings/payments', icon: <FiSettings className="sub-nav-icon" /> }
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
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''} admin-sidebar-font`}>
      <div className="sidebar-header">
        <h1>Admin Panel</h1>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <ChevronLeft className={`chevron-icon ${collapsed ? 'rotated' : ''}`} />
        </button>
      </div>

      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-wrapper">
            {item.subItems.length > 0 ? (
              <div
                className={`nav-link dash ${expandedItems[item.name] ? 'active' : ''}`}
                onClick={() => toggleItem(item.name)}
                style={{ cursor: 'pointer' }}
              >
                {item.icon}
                <span>{item.name}</span>
                <span className="dropdown-icon">
                  {expandedItems[item.name] ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </div>
            ) : (
              <Nav.Link
                as={Link}
                to={item.path}
                className={`nav-link dash ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Nav.Link>
            )}

            {item.subItems.length > 0 && (
              <div className={`dropdown-menu ${expandedItems[item.name] ? 'show' : ''}`}>
                {item.subItems.map((subItem, subIndex) => (
                  <Nav.Link
                    key={subIndex}
                    as={Link}
                    to={subItem.path}
                    className={`nav-link sub-link ${location.pathname === subItem.path ? 'active' : ''}`}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
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