package com.hcc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class AssignmentUpdateException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    public AssignmentUpdateException(String message) {
        super(message);
    }
}
