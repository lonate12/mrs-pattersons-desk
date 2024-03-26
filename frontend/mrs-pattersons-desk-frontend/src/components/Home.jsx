import { AuthData } from "../auth/AuthWrapper";
import { Link } from "react-router-dom";

export default function Home() {

    const { user } = AuthData();

    return (
        <>
            <h1 className="text-center pt-3">Welcome to the assignment review app!</h1>
            <div className="row justify-content-center mt-5">
                { user.isAuthenticated ? 
                    <Link to="assignments" className="btn btn-primary col-3">Go to Assignments</Link> :
                    <Link to="login" className="btn btn-primary col-3">Login</Link>
                }
            </div>
        </>
    );
}