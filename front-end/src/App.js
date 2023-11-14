import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AuthRegister from "./pages/Login/AuthRegister";
import {UserProvider} from "./hooks/UserProvider";
import AuthLogin from "./pages/Login/AuthLogin";
import {Layout} from "./components/Layout";
import Page from "./pages/Clients";

function App() {




  return (
      <UserProvider>
    <Router>
      <Layout>
      <Routes>
        <Route path="/register" element={<AuthRegister/>}/>
        <Route path="/" element={<AuthLogin/>}/>
        <Route path="/user" element={<Page/>}/>
      </Routes>
      </Layout>
    </Router>
        </UserProvider>
  );
}

export default App;
