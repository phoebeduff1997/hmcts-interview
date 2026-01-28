package org.interview.hmcts.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.interview.hmcts.entities.enums.Status;

import java.util.Arrays;

public class ValidStatusValidator implements ConstraintValidator<ValidStatus, Status>
{
	private Status[] allowedStatuses;

	@Override
	public void initialize(ValidStatus constraint) {
		this.allowedStatuses = constraint.anyOf();
	}

	@Override
	public boolean isValid(Status value, ConstraintValidatorContext context) {
		return value == null || Arrays.asList(allowedStatuses).contains(value);
	}
}
