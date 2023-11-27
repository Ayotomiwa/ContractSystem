import {useContext} from "react";
import UserContext from "./UserProvider";
import {Navigate, Route} from "react-router-dom";

const PrivateRoute = ({ path, element }) =>  {
    const { user } = useContext(UserContext);
    const Component = user && user.businessId ? element : <Navigate to='/' replace />;

    return <Route path={path} element={Component} />;
}

export default PrivateRoute;