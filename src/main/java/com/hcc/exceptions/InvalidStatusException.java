package com.hcc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidStatusException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    public InvalidStatusException(String message) {
        super(message);
    }
}
