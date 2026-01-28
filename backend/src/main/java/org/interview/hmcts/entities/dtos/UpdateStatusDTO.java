package org.interview.hmcts.entities.dtos;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.validators.ValidStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStatusDTO
{
	@NotNull(message = "Id cannot be null")
	private Long id;

	@NotNull(message = "Status cannot be null")
	@ValidStatus(anyOf = {Status.COMPLETE, Status.IN_PROGRESS, Status.NOT_STARTED},
			message = "Status cannot be overdue")
	@Enumerated(EnumType.STRING)
	private Status status;
}
