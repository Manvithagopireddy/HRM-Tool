package com.peoplecore.hrm.exception;

/** Thrown when a create operation violates a uniqueness constraint. */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
