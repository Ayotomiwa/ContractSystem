import { useContext } from "react";
import UserContext from "./UserProvider";
import { Navigate } from "react-router-dom";

const BusinessContent = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user || !user.businessId) {
        window.location.pathname = "/";
        return null;
    }

    return children;
};

export default BusinessContent;