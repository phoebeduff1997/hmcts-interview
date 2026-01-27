package org.interview.hmcts.entities.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.enums.Status;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO
{
	private Long id;
	private String title;
	private String description;
	private Status status;
	private Instant dueAt;
}
