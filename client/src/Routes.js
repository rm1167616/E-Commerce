import { createBrowserRouter, Navigate } from "react-router-dom";
import App from './App';
import Home from "./component/Shared/Home";
import NotFound from "./component/Shared/Error";



// Layouts for admin pages onlyyyyyyy////////////////////////////////////////////////////////////////////////////////////
import AdminLayout from "./component/Layout/AdminLayout";
import Dashboard from "./component/AdminCycle/DashBoard/Dashboard";
import AddProducts from "./component/AdminCycle/Forms/AddProductFrom";
import CategoryForm from "./component/AdminCycle/Forms/CategoryForm";
import AddCategory from "./component/AdminCycle/Forms/AddCategoryForm";



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
      { path: "AddProducts", element: <AddProducts /> }, // ✅ fixed here
      { path: "CategoryForm", element: <CategoryForm /> }, // ✅ fixed here
      { path: "AddCategory", element: <AddCategory /> }, // ✅ fixed here
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

