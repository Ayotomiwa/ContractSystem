import {useContext, useEffect} from "react";
import UserContext from "./UserProvider";
import { Navigate } from "react-router-dom";

const BusinessContent = ({ children }) => {
    const { user, isLoading} = useContext(UserContext);


        if (isLoading) {
            return null;
        }

            if(user && user.businessId){
                return children;
            }
            else{
                // window.location.pathname = "/";
                return null;
            }

        // ...
};

export default BusinessContent;