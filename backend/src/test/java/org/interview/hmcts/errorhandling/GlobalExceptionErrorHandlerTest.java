package org.interview.hmcts.errorhandling;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionErrorHandlerTest
{
	private final GlobalExceptionErrorHandler exceptionHandler = new GlobalExceptionErrorHandler();

	@Test
	void handleValidationError_shouldReturnCorrectResponse()
	{
		Object dummyObject = new Object();

		BindingResult bindingResult = new BeanPropertyBindingResult(dummyObject, "testObject");
		bindingResult.addError(new FieldError("testObject", "testField", "test message"));
		MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

		ResponseEntity<Map<String, Object>> response = exceptionHandler.handleValidationError(exception);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

		Map<String, Object> body = response.getBody();
		assertNotNull(body);

		List<Map<String, String>> errors = (List<Map<String, String>>) body.get("errors");
		Map<String, String> error = errors.get(0);

		assertAll(
				() -> assertTrue(body.containsKey("timestamp")),
				() -> assertTrue(body.get("timestamp") instanceof Instant),
				() -> assertEquals(400, body.get("status")),
				() -> assertEquals("testField", error.get("field")),
				() -> assertEquals("test message", error.get("message"))
		);
	}

	@Test
	void handleMissingEntityError_shouldReturnMissingEntityErrorResponse() {
		EntityNotFoundException exception = new EntityNotFoundException("test cannot be found");

		ResponseEntity<Map<String, Object>> response = exceptionHandler.handleMissingEntityError(exception);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

		Map<String, Object> body = response.getBody();

		assertAll(
				() -> assertNotNull(body),
				() -> assertTrue(body.containsKey("timestamp")),
				() -> assertTrue(body.get("timestamp") instanceof Instant),
				() -> assertEquals(404, body.get("status")),
				() -> assertEquals("Resource not found", body.get("error")),
				() -> assertEquals("test cannot be found", body.get("message"))
		);
	}

	@Test
	void handleGenericException_shouldReturnInternalServerErrorResponse() {
		Exception exception = new Exception("Something went wrong");

		ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGenericException(exception);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

		Map<String, Object> body = response.getBody();

		assertAll(
				() -> assertNotNull(body),
				() -> assertTrue(body.containsKey("timestamp")),
				() -> assertTrue(body.get("timestamp") instanceof Instant),
				() -> assertEquals(500, body.get("status")),
				() -> assertEquals("Internal Server Error", body.get("error")),
				() -> assertEquals("Something went wrong", body.get("message"))
		);
	}
}