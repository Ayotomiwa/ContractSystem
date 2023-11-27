import React, {createContext, useState, useContext, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import {useLocation, useNavigate} from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);


    useEffect(() => {
        setIsAuthenticating(true);
        const user = sessionStorage.getItem('user');
        if (user) {
            const decodedToken = jwtDecode(JSON.parse(user).token);
            if (decodedToken.exp * 1000 < Date.now()) {
                sessionStorage.removeItem('user');
            } else {
                setUser(JSON.parse(user));
            }
        }
        setIsAuthenticating(false);
    }, []);


    const login = (user, path) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        console.log("User is logged in " + user.token)
        console.log("User is logged in " + user.businessId)
        if(path){
            window.location.pathname = path;
        }
        else{
            const storedPath = sessionStorage.getItem('pathBeforeLogin');
            console.log("storedPath: ", storedPath);
            if(storedPath){
                window.location.pathname = storedPath;
            }
            else{
                window.location.pathname = '/contracts';
            }
        }
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };


    return (
        <UserContext.Provider value={{ user, login, isAuthenticating, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
