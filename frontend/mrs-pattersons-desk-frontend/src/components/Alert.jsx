import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import 'animate.css';

const Alert = ({message, alertKind}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            window.history.replaceState({}, '');
            setIsVisible(false);
        }, 2000);
    }, []);

    const dismiss = () => {
        window.history.replaceState({}, '');
        setIsVisible(false);
    }

    return (
        <div 
            className={`text-center pt-3 pb-3 position-absolute ${isVisible ? "animate__animated animate__bounceInDown" : "animate__animated animate__bounceOutUp"}`}
            style={{width: "98%"}}
            onClick={dismiss}
            >
            <div className={`alert ${alertKind}`} role="alert">
                { message }
            </div>
        </div>
    );
}

Alert.propTypes = {
    message: PropTypes.string,
    alertKind: PropTypes.string
}

export default Alert;

// Alert animations done with Animation.css (https://https://animate.style/)