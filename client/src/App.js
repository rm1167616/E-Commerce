import "./App.css";
import { Outlet } from "react-router-dom";
import HeaderUser from "./component/Shared/Header.js";
import Footer from "./component/Shared/Footer.js";
import About from './component/About Page/About.jsx'
// import {AuthProvider} from "./Context/AuthContext.js";
import 'bootstrap/dist/css/bootstrap.min.css'; 

const App = () => {
  return (
      <>
      
      {/* <About/> */}
      <HeaderUser />
      <Outlet /> {/* This ensures your pages load here */}
     <Footer/>
      </>
  );
};

export default App;
