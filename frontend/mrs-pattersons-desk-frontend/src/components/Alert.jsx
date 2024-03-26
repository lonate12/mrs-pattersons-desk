import { useState } from "react";
import PropTypes from "prop-types";

const Alert = ({message, alertKind}) => {
    const [isVisible, setIsVisible] = useState(true);

    const dismiss = () => {
        window.history.replaceState({}, '');
        setIsVisible(false);
    }

    return (
        <div className={`text-center pt-3 pb-3 ${isVisible ? "" : "d-none"}`}>
            <div className={`alert ${alertKind}`} role="alert">
                { message }
                <span className="float-end alert-dismiss" onClick={dismiss}>X</span>
            </div>
        </div>
    );
}

Alert.propTypes = {
    message: PropTypes.string,
    alertKind: PropTypes.string
}

export default Alert;