import React, {createContext, useState, useContext, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import {useLocation, useNavigate} from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [lastUser, setLastUser] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [timedOut, setTimedOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    let storedPath;



    useEffect(() => {
        setIsAuthenticating(true);
        const user = localStorage.getItem('user');
        const lastUser = localStorage.getItem('lastUser');
        if(lastUser){
            setLastUser(JSON.parse(lastUser));
        }
        if (user) {
            const decodedToken = jwtDecode(JSON.parse(user).token);
            const tokenLifespan = decodedToken.exp - decodedToken.iat;
            const halfExpiryTime = decodedToken.iat + (tokenLifespan / 2);
            if (halfExpiryTime * 1000 < Date.now()) {
                localStorage.removeItem('user');
                setTimedOut(true);
            } else {
                setUser(JSON.parse(user));
            }
        }
        setIsAuthenticating(false);
        setIsLoading(false);
    }, []);



    const login = (user, path) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        if(path){
            window.location.pathname = path;
        }
        else{
            storedPath = localStorage.getItem('pathBeforeLogin');
            if(storedPath){
                if(storedPath.startsWith('/contract/edit/') && (lastUser.id !== user.id || lastUser.businessId !== user.businessId) && timedOut){
                    storedPath = '/';
                    setTimedOut(false);
                }
                window.location.pathname = storedPath;
            }
            else{
                window.location.pathname = '/';
            }
        }
        setLastUser(user);
    };

    const logout = () => {
        // setIsAuthenticating(true)
        localStorage.removeItem('lastUser');
        localStorage.removeItem('user');
        localStorage.removeItem('pathBeforeLogin');
            return new Promise((resolve) => {
                setTimedOut(false);
                setUser(null);
                resolve();
            });
    };


    return (
        <UserContext.Provider value={{ user, login, isAuthenticating, logout, timedOut}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
