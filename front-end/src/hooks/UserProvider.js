import React, {createContext, useState, useContext, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import {useLocation, useNavigate} from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [lastUser, setLastUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    let storedPath;



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
        setIsLoading(false);
    }, []);



    useState(() => {




    },[storedPath]);





    const login = (user, path) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.removeItem('lastUser');
        setUser(user);

        if(path){
            window.location.pathname = path;
        }
        else{
            storedPath = sessionStorage.getItem('pathBeforeLogin');
            if(storedPath){
                const lastUser = sessionStorage.getItem('lastUser');
                if(storedPath.startsWith('/contract/edit/') && (lastUser.id !== user.id || lastUser.businessId !== user.businessId)){
                    storedPath = '/';
                }
                window.location.pathname = storedPath;
            }
            else{
                window.location.pathname = '/contracts';
            }
        }
    };

    const logout = () => {
        const lastUser = sessionStorage.getItem('lastUser');
        sessionStorage.setItem('lastUser', JSON.stringify(lastUser));
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('pathBeforeLogin');
        setUser(null);
    };


    return (
        <UserContext.Provider value={{ user, login, isAuthenticating, logout, storedPath}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
