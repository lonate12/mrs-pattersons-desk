import { AuthData } from "../auth/AuthWrapper";

export default function Header() {

    const { user } = AuthData();

    return (
        <div className="row justify-content-center">
            <h1 className="col-6 text-center">{user.name ? `Welcome ${user.name}` : "Welcome to the home page. No one is logged in yet."}</h1>
        </div>
    );
}