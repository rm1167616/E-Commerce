import { createBrowserRouter, Navigate } from "react-router-dom";
import App from './App';
import Home from "./component/Shared/Home";
import NotFound from "./component/Shared/Error";



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



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> }, // shows at "/"
    ],
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
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

