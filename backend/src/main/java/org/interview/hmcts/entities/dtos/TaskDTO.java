package org.interview.hmcts.entities.dtos;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.validators.ValidStatus;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO
{
	private Long id;

	@NotBlank(message = "Title cannot be blank")
	@Size(max = 255, message = "Title must be less than 255 characters")
	private String title;

	private String description;

	@NotNull(message = "Status cannot be null")
	@ValidStatus(anyOf = {Status.COMPLETE, Status.IN_PROGRESS, Status.NOT_STARTED},
			message = "Status cannot be overdue")
	@Enumerated(EnumType.STRING)
	private Status status;

	@NotNull(message = "Due at time cannot be null")
	private Instant dueAt;
}
