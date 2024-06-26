package com.hcc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class InsufficientPermissionsException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public InsufficientPermissionsException(String message) {
            super(message);
        }
}
