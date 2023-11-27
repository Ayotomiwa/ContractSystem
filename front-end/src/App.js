import './App.css';
import React, {useContext, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import AuthRegister from "./pages/Login/AuthRegister";
import UserContext, {UserProvider} from "./hooks/UserProvider";
import AuthLogin from "./pages/Login/AuthLogin";
import {Layout} from "./components/Layout";
import Clients from "./pages/Client/Clients";
import Products from "./pages/Products/Products";
import ClientForm from "./pages/Client/ClientForm";
import Templates from "./pages/Templates/Templates";
import ContractsOverview from "./pages/Contracts/ContractsOverview";
import ContractManagementApp from "./pages/Landing/ContractManagementApp";
import CMAPP2  from "./pages/Landing/CMAPP2";
import CMAPP4 from "./pages/Landing/CMAPP4";
import PrivateRoute from "./hooks/BusinessContent";
import BusinessContent from "./hooks/BusinessContent";


  function App() {
    const location = useLocation();
    const { user, isAuthenticating } = useContext(UserContext);
    const navigate = useNavigate();



    useEffect(() => {
      console.log("App.js: ", user + " " + location.pathname);
      const publicPaths = ['/', '/login', '/register'];
      if (!isAuthenticating && !user && !publicPaths.includes(location.pathname)) {
        sessionStorage.setItem('pathBeforeLogin', location.pathname);
        window.location.pathname = '/login';
      }

    }, [user, location, navigate, isAuthenticating]);


  return (
      <Layout>
      <Routes>
        <Route path="/login" element={<AuthLogin/>}/>
        <Route path="/register" element={<AuthRegister/>}/>
        <Route path="/" element={<CMAPP2/>}/>
        <Route path="/clients" element={<BusinessContent><Clients/></BusinessContent>}/>
        <Route path="/products" element={<BusinessContent><Products/></BusinessContent>}/>
        <Route path="/contracts" element={<ContractsOverview/>}/>
        <Route path="/clients/edit/*" element={<ClientForm/>}/>
        <Route path="/templates" element={<Templates/>}/>
        <Route path="*" element={<h1>Not Found</h1>}/>
      </Routes>
      </Layout>
  );
}

export default App;
