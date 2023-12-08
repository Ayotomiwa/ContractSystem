import './App.css';
import React, {useContext, useEffect} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import AuthRegister from "./pages/Login/AuthRegister";
import UserContext from "./hooks/UserProvider";
import AuthLogin from "./pages/Login/AuthLogin";
import {Layout} from "./components/Layout";
import Clients from "./pages/Client/Clients";
import Products from "./pages/Products/Products";
import ClientForm from "./pages/Client/ClientForm";
import Templates from "./pages/Templates/Templates";
import ContractsOverview from "./pages/Contracts/ContractsOverview";
import LandingPage from "./pages/Landing/LandingPage";
import BusinessContent from "./hooks/BusinessContent";
import Inbox from "./pages/Inbox/Inbox";
import ContractEdit from "./pages/Contracts/ContractEdit";


function App() {
    const location = useLocation();
    const { user, isAuthenticating } = useContext(UserContext);
    const navigate = useNavigate();



    useEffect(() => {
      const publicPaths = ['/', '/login', '/register', '/templates'];
      console.log("App.js: path ", location.pathname);

      if (!isAuthenticating && !user && !publicPaths.includes(location.pathname)) {
          localStorage.setItem('pathBeforeLogin', location.pathname);
          console.log("App.js private path not logged in: pathBeforeLogin ", localStorage.getItem('pathBeforeLogin'))
          window.location.pathname = '/login';
      }
      else{
            console.log("App.js: path else 2 ", location.pathname);
      }

    }, [user, location, navigate, isAuthenticating]);


  return (
      <Layout>
      <Routes>
          <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<AuthLogin/>}/>
        <Route path="/register" element={<AuthRegister/>}/>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/clients" element={<BusinessContent><Clients/></BusinessContent>}/>
        <Route path="/products" element={<BusinessContent><Products/></BusinessContent>}/>
        <Route path="/inbox" element={<Inbox/>}/>
        <Route path="/contracts" element={<ContractsOverview/>}/>
        <Route path="/contract/edit/*" element={<BusinessContent><ContractEdit/></BusinessContent>}/>
        <Route path="/clients/edit/*" element={<BusinessContent><ClientForm/></BusinessContent>}/>
        <Route path="/templates" element={<Templates/>}/>
        <Route path="*" element={<h1 style={{display:"grid", placeItems:"center"}}>Not Found</h1>}/>
      </Routes>
      </Layout>
  );
}

export default App;
