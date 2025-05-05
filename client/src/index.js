import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from "react-router-dom";
import {router} from "./Routes"
import {AuthProvider} from "./component/Context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <RouterProvider router = {router} />
    </AuthProvider>
);


reportWebVitals();
