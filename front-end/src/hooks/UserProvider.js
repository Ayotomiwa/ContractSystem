import React, {createContext, useState, useContext, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const decodedToken = jwtDecode(JSON.parse(user).token);
            if (decodedToken.exp * 1000 < Date.now()) {
                sessionStorage.removeItem('user');
            } else {
                setUser(user);
            }
        }
    }, [user]);

    const login = (user, path) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        if(path){
            window.location.pathname = path;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    };


    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
