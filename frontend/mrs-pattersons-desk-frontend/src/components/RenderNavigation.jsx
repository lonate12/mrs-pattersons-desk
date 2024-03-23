import { AuthData } from "../auth/AuthWrapper";
import { nav } from "../helpers/navigation";
import { Routes, Route, Link } from "react-router-dom";
import NotFound from "./NotFound";

export const RenderRoutes = () => {
    const {user} = AuthData();

    return (
        <div className="row justify-content-center">
            <div className="container-fluid">
                <Routes>
                    {
                        nav.map((r, i) => {
                            if (r.isPrivate && user.isAuthenticated) {
                                return <Route key={i} path={r.path} element={r.element} />;
                            } else if (!r.isPrivate) {
                                return <Route key={i} path={r.path} element={r.element} />;
                            } else return false;
                        })
                    }
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

const MenuItem = ({r}) => {
    return (
        <li className="nav-item">
            <Link className="nav-link" to={r.path}>{r.name}</Link>
        </li>
    );
}

export const RenderMenu = () => {
    const {user, logout} = AuthData();

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Mrs. Patterson's Desk</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                                nav.map((r, i) => {
                                    if (!r.isPrivate && r.isMenu) {
                                        return (
                                            <MenuItem key={i} r={r} />
                                        );
                                    } else if (user.isAuthenticated && r.isMenu) {
                                        return (
                                            <MenuItem key={i} r={r} />
                                        );
                                    } else return false;
                                })
                            }
                            {
                                user.isAuthenticated ?
                                    <li className="nav-item"><Link className="nav-link" to={'/'} onClick={logout}>Log out</Link></li> :
                                    <li className="nav-item"><Link className="nav-link" to={'login'}>Log in</Link></li>
                            }
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}