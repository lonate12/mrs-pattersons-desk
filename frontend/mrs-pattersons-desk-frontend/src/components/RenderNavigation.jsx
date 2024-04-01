import { AuthData } from "../auth/AuthWrapper";
import { nav } from "../helpers/navigation";
import { Routes, Route, Link } from "react-router-dom";
import NotFound from "./NotFound";
import PropTypes from 'prop-types';

export const RenderRoutes = () => {
    const {user} = AuthData();

    return (
        // <div className="row justify-content-center">
            <div className="container-fluid d-flex justify-content-center">
                <div className="row bg-light col-10 position-relative" style={{marginTop: 20, marginBottom: 20, paddingBottom: 20}}>
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
        // </div>
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
                    <Link className="navbar-brand position-relative" to="/">{"Mrs. Patterson's Desk"} { user.isReviewer ? <span className="badge text-danger">[ Reviewer ]</span> : null}</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                    {
                                nav.map((r, i) => {
                                    if (!r.isPrivate && r.isMenu) {
                                        return (
                                            <MenuItem key={i} r={r} />
                                        );
                                    } else if (user.isAuthenticated && r.isMenu) {
                                        if (r.name === "Submit assignment" && user.isReviewer) {
                                            return false;
                                        }
                                        return (
                                            <MenuItem key={i} r={r} />
                                        );
                                    } else return false;
                                })
                            }
                            {
                                user.isAuthenticated ?
                                    <li className="nav-item"><Link className="nav-link" to={'/'} onClick={logout}>Log out</Link></li> : null
                            }
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

MenuItem.propTypes = {
    r: PropTypes.object
}