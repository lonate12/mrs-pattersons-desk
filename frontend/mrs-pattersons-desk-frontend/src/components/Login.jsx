import { AuthData } from "../auth/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginCall } from "../helpers/apiCalls";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types'


export default function Login() {

    const [ errorMessage, setErrorMessage ] = useState(null);
    const [formData, setFormData] = useState({});
    const { updateLoggedInUser } = AuthData();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value }));
    }

    const doLogin = async (e) => {
        e.preventDefault();
        const response = await loginCall(formData.username, formData.password);

        if (response.status === 401) {
            setErrorMessage("Invalid username/password");
            return;
        }

        localStorage.setItem("mrsPattersonsDesk", JSON.stringify({token: response.token}));
        const decodedToken = jwtDecode(response.token);

        updateLoggedInUser(decodedToken, response.token);
        navigate("/assignments");
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <form className="col-md-6 login-form">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Email address</label>
                            <input type="email" onChange={handleChange} className="form-control" id="username" name="username" required={true}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" onChange={handleChange} className="form-control" id="password" name="password" required={true}/>
                        </div>
                        <button type="submit" onClick={doLogin} className="btn btn-primary">Submit</button>
                    </form>
                    <div id="errorPlaceholder" className="row justify-content-center">
                        { errorMessage ? 
                            <ErrorMessage message={errorMessage} />
                            : null
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

const ErrorMessage = ({message}) => {
    return (
        <div className="alert alert-danger alert-dismissable col-6" role="alert">
            <div className="row">
                <div className="col-11">{message}</div>
                <button type="button" className="btn-close col-1" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    );
}

ErrorMessage.propTypes = {
    message: PropTypes.string
}