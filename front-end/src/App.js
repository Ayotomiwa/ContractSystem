import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AuthRegister from "./pages/Login/AuthRegister";
import {UserProvider} from "./hooks/UserProvider";
import AuthLogin from "./pages/Login/AuthLogin";
import {Layout} from "./components/Layout";
import Clients from "./pages/Client/Clients";
import Products from "./pages/Products/Products";
import ClientForm from "./pages/Client/ClientForm";
import Templates from "./pages/Templates/Templates";
import ContractsOverview from "./pages/Contracts/ContractsOverview";

function App() {




  return (
      <UserProvider>
    <Router>
      <Layout>
      <Routes>
        <Route path="/register" element={<AuthRegister/>}/>
        <Route path="/" element={<AuthLogin/>}/>
        <Route path="/clients" element={<Clients/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/contracts" element={<ContractsOverview/>}/>
        <Route path="/clients/edit/*" element={<ClientForm/>}/>
        <Route path="/templates" element={<Templates/>}/>
        <Route path="*" element={<h1>Not Found</h1>}/>
      </Routes>
      </Layout>
    </Router>
        </UserProvider>
  );
}

export default App;
