import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../AdminCycle/Sidebar/Sidebar';
import './AdminLayout.css';
// const {isAuthenticated, isAdmin} = useAuth(); // Comment out for now if auth not set up

const AdminLayout = () => {
    // TEMP AUTH BYPASS
    const isAuthenticated = () => true;
    const isAdmin = () => true;

    const [collapsed, setCollapsed] = useState(false);

    if (!isAuthenticated() || !isAdmin()) {
        return <Navigate to="/" />;
    }

    return (
        <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
