package com.peoplecore.hrm.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler — converts domain exceptions to RFC-9457 Problem Details.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 400 Bad Request ──────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                        (a, b) -> a
                ));

        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation Failed");
        pd.setType(URI.create("https://hrm.peoplecore.com/errors/validation"));
        pd.setProperty("errors", errors);
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusiness(BusinessException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Business Rule Violation");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    // ── 401 Unauthorized ──────────────────────────────────────

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        pd.setTitle("Authentication Failed");
        pd.setDetail("Invalid email or password");
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    // ── 403 Forbidden ────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        pd.setTitle("Access Denied");
        pd.setDetail("You do not have permission to perform this action");
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    // ── 404 Not Found ─────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Resource Not Found");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    // ── 409 Conflict ─────────────────────────────────────────

    @ExceptionHandler(DuplicateResourceException.class)
    public ProblemDetail handleDuplicate(DuplicateResourceException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        pd.setTitle("Duplicate Resource");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    // ── 500 Internal Server Error ─────────────────────────────

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneral(Exception ex) {
        log.error("Unhandled exception", ex);
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Internal Server Error");
        pd.setDetail("An unexpected error occurred. Please try again later.");
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }
}
