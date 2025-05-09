// src/router.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from './App';
import Home from './component/Shared/Home';
import About from './component/About Page/About';
import Profile from './component/Profile/Section/Profile';
import WishList from './component/WishList/Sections/WishList';
import NotFound from './component/Shared/Error';

// Layouts for admin pages onlyyyyyyy////////////////////////////////////////////////////////////////////////////////////
import AdminLayout from "./component/Layout/AdminLayout";
import Dashboard from "./component/AdminCycle/DashBoard/Dashboard";
import ProductShow from "./component/AdminCycle/Product/ProductShow";
import AddProducts from "./component/AdminCycle/Forms/AddProductFrom";
import CategoryForm from "./component/AdminCycle/categories/CategoryShow";
import AddCategory from "./component/AdminCycle/Forms/AddCategoryForm";
import OfferTable from "./component/AdminCycle/tables/OfferTable";
import AddOffer from "./component/AdminCycle/Forms/AddOffer";
import UsersTable from "./component/AdminCycle/tables/UsersTable";
import AddUserForm from "./component/AdminCycle/Forms/AddUserForm";
import NavSettingsForm from "./component/AdminCycle/Forms/NavSettingsForm";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },           // "/"
      { path: "about",    element: <About /> },     // "/about"
      { path: "profile",  element: <Profile /> },   // "/profile"
      { path: "wishlist", element: <WishList /> },  // "/wishlist"
    ]
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> }, // ✅ fixed here
      { path: "ProductShow", element: <ProductShow /> }, // ✅ fixed here
      { path: "AddProducts", element: <AddProducts /> }, // ✅ fixed here
      { path: "CategoryForm", element: <CategoryForm /> }, // ✅ fixed here
      { path: "AddCategory", element: <AddCategory /> }, // ✅ fixed here 
      { path: "OfferTable", element: <OfferTable /> }, // ✅ fixed here 
      { path: "AddOffer", element: <AddOffer /> }, // ✅ fixed here 
      { path: "UsersTable", element: <UsersTable /> }, // ✅ fixed here 
      { path: "AddUserForm", element: <AddUserForm /> }, // ✅ fixed here 
      { path: "NavSettingsForm", element: <NavSettingsForm /> }, // ✅ fixed here 
    ],
  },

  // catch-all 404
  {
    path: "*",
    element: <NotFound />
  }
]);
