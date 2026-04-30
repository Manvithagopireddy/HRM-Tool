package com.peoplecore.hrm.exception;

/** Thrown when a business rule is violated (e.g. overlapping leave). */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
