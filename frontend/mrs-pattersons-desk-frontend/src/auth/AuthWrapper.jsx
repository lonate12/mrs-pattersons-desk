import { createContext, useContext, useState, useEffect } from 'react';
import { RenderMenu, RenderRoutes } from "../components/RenderNavigation.jsx";
import { jwtDecode } from 'jwt-decode';
import { addTrailingZeros } from "../helpers/utils.js";

const AuthContext = createContext();

export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {

    const [user, setUser] = useState({name: "", isAuthenticated: false, role: null, token:null, isReviewer: false});

    useEffect(() => {
        const loadedToken = localStorage.getItem("mrsPattersonsDesk");
        if (loadedToken !== null) {
            const token = JSON.parse(loadedToken).token;
            const decodedToken = jwtDecode(token);

            if (addTrailingZeros(decodedToken.exp) < Date.now()) {
                localStorage.removeItem("mrsPattersonsDesk");
                return;
            }

            const authority = decodedToken.scopes[0].authority;
            const isReviewer = authority === "ROLE_CODE_REVIEWER" ? true : false;

            setUser({name: decodedToken.sub, isAuthenticated: true, role: authority, token: token, isReviewer: isReviewer});
        }
    }, []);

    const updateLoggedInUser = (userInfo, token) => {
        const authority = userInfo.scopes[0].authority;
        const isReviewer = authority === "ROLE_CODE_REVIEWER" ? true : false;

        setUser({name: userInfo.sub, isAuthenticated: true, role: authority, token: token, isReviewer: isReviewer});
    }

    const logout = () => {
        localStorage.removeItem("mrsPattersonsDesk");
        setUser({name: "", isAuthenticated: false, role: null});
    }

    return (
        <AuthContext.Provider value={{user, updateLoggedInUser, logout}}>
            <>
                <RenderMenu />
                <RenderRoutes />
            </>
        </AuthContext.Provider>
    );
}

// Dynamically generated private and public routes and nav bar pattern copied and modified for this project from
// KodieCode YouTube video "How to create Protected Routes and Authentication with React Router V6 2023"
// https://youtu.be/q94v5AhgrW4?si=T_QIELFjW8Qk1GBE