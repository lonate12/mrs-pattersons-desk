import { AuthData } from "../auth/AuthWrapper";
import { Link } from "react-router-dom";

export default function Home() {

    const { user } = AuthData();

    return (
        <>
            <h1 className="text-center pt-3">Welcome to the assignment review app!</h1>
                <div className="container mt-5 justify-content-center d-flex">
                { user.isAuthenticated ? 
                    <Link to="assignments" className="btn btn-primary col-lg-3 col-12">Go to Assignments</Link> :
                    <Link to="login" className="btn btn-primary col-lg-3 col-12">Login</Link>
                }
                </div>
        </>
    );
}