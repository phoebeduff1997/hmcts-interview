package org.interview.hmcts.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.interview.hmcts.entities.enums.Status;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidStatusValidator.class)
public @interface ValidStatus
{
	Status[] anyOf();
	String message() default "Status must be any of {anyOf}";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
}
