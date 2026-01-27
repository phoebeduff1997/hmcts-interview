package org.interview.hmcts.utils.test;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.dtos.TaskDTO;

import static org.junit.jupiter.api.Assertions.*;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AssertionUtils
{
	public static void assertTaskDTOsEqual(TaskDTO expectedTask, TaskDTO task)
	{
		assertAll(
				() -> assertNotNull(task),
				() -> assertNotNull(task.getId()),
				() -> assertEquals(expectedTask.getId(), task.getId()),
				() -> assertEquals(expectedTask.getTitle(), task.getTitle()),
				() -> assertEquals(expectedTask.getDescription(), task.getDescription()),
				() -> assertEquals(expectedTask.getStatus(), task.getStatus()),
				() -> assertEquals(expectedTask.getDueAt(), task.getDueAt())
		);
	}
}
