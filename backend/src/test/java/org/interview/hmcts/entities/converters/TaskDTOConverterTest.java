package org.interview.hmcts.entities.converters;

import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.enums.Status;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.interview.hmcts.utils.test.AssertionUtils.assertTaskDTOsEqual;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

class TaskDTOConverterTest
{
	private static final Long ID = 1L;
	private static final String TITLE = "Test title";
	private static final String DESCRIPTION = "Test description";
	private static final Status STATUS = Status.COMPLETE;
	private static final Instant DUE_AT = Instant.parse("2026-01-26T12:00:00Z");

	@Test
	void toDTOShouldReturnCorrectValues()
	{
		Task task = Task.builder()
				.id(ID)
				.title(TITLE)
				.description(DESCRIPTION)
				.status(STATUS)
				.dueAt(DUE_AT)
				.build();

		TaskDTO taskDTO = TaskDTOConverter.toDTO(task);

		assertAll(
			() -> assertEquals(task.getId(), taskDTO.getId()),
			() -> assertEquals(task.getTitle(), taskDTO.getTitle()),
			() -> assertEquals(task.getDescription(), taskDTO.getDescription()),
			() -> assertEquals(task.getStatus(), taskDTO.getStatus()),
			() ->assertEquals(task.getDueAt(), taskDTO.getDueAt())
		);
	}

	@Test
	void toEntityShouldReturnCorrectValues()
	{
		TaskDTO taskDTO = TaskDTO.builder()
				.id(ID)
				.title(TITLE)
				.description(DESCRIPTION)
				.status(STATUS)
				.dueAt(DUE_AT)
				.build();

		Task task = TaskDTOConverter.toEntity(taskDTO);

		assertAll(
				() -> assertEquals(taskDTO.getId(), task.getId()),
				() -> assertEquals(taskDTO.getTitle(), task.getTitle()),
				() -> assertEquals(taskDTO.getDescription(), task.getDescription()),
				() -> assertEquals(taskDTO.getStatus(), task.getStatus()),
				() ->assertEquals(taskDTO.getDueAt(), task.getDueAt())
		);
	}
}