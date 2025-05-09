// src/router.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Home from './component/Shared/Home';
import About from './component/About Page/About';
import Profile from './component/Profile/Section/Profile';
import WishList from './component/WishList/Sections/WishList';
import NotFound from './component/Shared/Error';

// Admin imports
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
import PagesManagement from "./component/AdminCycle/Pages/PagesManagement"; 
import PageSettingsForm from "./component/AdminCycle/Forms/PageForm"; 
import AboutUsForm from "./component/AdminCycle/Forms/AboutUsForm"; 

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
    path: "/admin/ProductShow",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Navigate to="dashboard" replace /> },  // "/admin" -> "/admin/dashboard"
      { path: "dashboard", element: <Dashboard /> },              // "/admin/dashboard"
      { path: "product-show", element: <ProductShow /> },         // "/admin/product-show"
      { path: "add-products", element: <AddProducts /> },         // "/admin/add-products"
      { path: "category-form", element: <CategoryForm /> },       // "/admin/category-form"
      { path: "add-category", element: <AddCategory /> },         // "/admin/add-category"
      { path: "offer-table", element: <OfferTable /> },           // "/admin/offer-table"
      { path: "add-offer", element: <AddOffer /> },               // "/admin/add-offer"
      { path: "users-table", element: <UsersTable /> },           // "/admin/users-table"
      { path: "add-user-form", element: <AddUserForm /> },        // "/admin/add-user-form"
      { path: "nav-settings-form", element: <NavSettingsForm /> }, // "/admin/nav-settings-form"
      { path: "pages-management", element: <PagesManagement /> },  // "/admin/pages-management"
      { path: "page-settings-form", element: <PageSettingsForm /> }, // "/admin/page-settings-form"
      { path: "about-us-form", element: <AboutUsForm /> },         // "/admin/about-us-form"
    ],
  },
  // catch-all 404
  {
    path: "*",
    element: <NotFound />
  }
]);