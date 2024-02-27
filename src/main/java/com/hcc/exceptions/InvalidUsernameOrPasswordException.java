package com.hcc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class InvalidUsernameOrPasswordException extends AuthenticationException {

    private static final long serialVersionUID = 1L;
    public InvalidUsernameOrPasswordException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public InvalidUsernameOrPasswordException(String msg) {
        super(msg);
    }
}
