package org.interview.hmcts.entities.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.enums.Status;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStatusDTO
{
	private Long id;
	private Status status;
}
