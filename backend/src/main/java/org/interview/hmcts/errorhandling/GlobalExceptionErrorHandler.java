package org.interview.hmcts.errorhandling;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionErrorHandler
{

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidationError(MethodArgumentNotValidException ex)
	{
		Map<String, Object> errors = new LinkedHashMap<>();
		errors.put("timestamp", Instant.now());
		errors.put("status", HttpStatus.BAD_REQUEST.value());
		errors.put("errors", ex.getBindingResult().getFieldErrors()
				.stream()
				.map(err -> {
					log.warn(err.getField() + ": " + err.getDefaultMessage());
					return Map.of("field", err.getField(), "message", err.getDefaultMessage());
				})
				.toList());
		return ResponseEntity.badRequest().body(errors);
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleMissingEntityError(EntityNotFoundException ex)
	{
		Map<String, Object> error = new LinkedHashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.NOT_FOUND.value());
		error.put("error", "Resource not found");
		error.put("message", ex.getMessage());

		log.warn(ex.getMessage());

		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex)
	{
		Map<String, Object> error = new LinkedHashMap<>();
		error.put("timestamp", Instant.now());
		error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.put("error", "Internal Server Error");
		error.put("message", ex.getMessage());

		log.warn(ex.getMessage());

		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
	}
}
