package org.interview.hmcts.errorhandling;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionErrorHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidationError(MethodArgumentNotValidException ex) {
		Map<String, Object> errors = new LinkedHashMap<>();
		errors.put("timestamp", Instant.now());
		errors.put("status", HttpStatus.BAD_REQUEST.value());
		errors.put("errors", ex.getBindingResult().getFieldErrors()
				.stream()
				.map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage()))
				.toList());
		return ResponseEntity.badRequest().body(errors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
		Map<String, Object> errors = new LinkedHashMap<>();
		errors.put("timestamp", Instant.now());
		errors.put("status", HttpStatus.BAD_REQUEST.value());
		errors.put("errors", ex.getConstraintViolations()
				.stream()
				.map(v -> Map.of("field", v.getPropertyPath().toString(), "message", v.getMessage()))
				.toList());
		return ResponseEntity.badRequest().body(errors);
	}
}
