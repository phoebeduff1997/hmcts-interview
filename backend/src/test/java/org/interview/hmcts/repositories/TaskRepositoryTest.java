package org.interview.hmcts.repositories;

import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.enums.Status;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.stream.Stream;

import static org.interview.hmcts.utils.test.CreateEntityUtils.createTask;
import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DataJpaTest
class TaskRepositoryTest
{
	@Autowired
	private TaskRepository taskRepository;

	@ParameterizedTest
	@MethodSource("findOverdueTasks")
	void findTasksToUpdateToOverdue_shouldFindTaskIfOverdue(Status status, boolean dueBeforeToday, boolean shouldBeUpdated)
	{
		Task task = createTaskWithVariableTime(status, dueBeforeToday);
		taskRepository.save(task);

		List<Task> overdueTasks = taskRepository.findTasksToUpdateToOverdue();

		assertEquals(shouldBeUpdated, overdueTasks.contains(task));
	}

	@ParameterizedTest
	@MethodSource("hasStatusChanged")
	void updateAndReturnOverdueTasks_shouldUpdateInProgressOverdueTasks(Status status, boolean dueBeforeToday,
																		Status expectedStatus)
	{
		Task task = createTaskWithVariableTime(status, dueBeforeToday);
		Task originalTask = createTaskWithVariableTime(status, dueBeforeToday);
		taskRepository.save(task);

		taskRepository.updateAndReturnOverdueTasks();

		assertAll(
				() -> assertNotNull(task),
				() -> assertNotNull(task.getId()),
				() -> assertTrue(expectedStatus == task.getStatus()),
				() -> assertEquals(originalTask.getTitle(), task.getTitle()),
				() -> assertEquals(originalTask.getDescription(), task.getDescription()),
				() -> assertEquals(originalTask.getDueAt(), task.getDueAt())
		);
	}

	private Stream<Arguments> hasStatusChanged()
	{
		return Stream.of(
				Arguments.of(Status.IN_PROGRESS, true, Status.OVERDUE),
				Arguments.of(Status.NOT_STARTED, true, Status.OVERDUE),
				Arguments.of(Status.OVERDUE, true, Status.OVERDUE),
				Arguments.of(Status.COMPLETE, true, Status.COMPLETE),
				Arguments.of(Status.IN_PROGRESS, false, Status.IN_PROGRESS),
				Arguments.of(Status.NOT_STARTED, false, Status.NOT_STARTED)
		);
	}

	private Stream<Arguments> findOverdueTasks()
	{
		return Stream.of(
				Arguments.of(Status.IN_PROGRESS, true, true),
				Arguments.of(Status.NOT_STARTED, true, true),
				Arguments.of(Status.COMPLETE, true, false),
				Arguments.of(Status.OVERDUE, true, false),
				Arguments.of(Status.IN_PROGRESS, false, false),
				Arguments.of(Status.NOT_STARTED, false, false)
		);
	}

	private Task createTaskWithVariableTime(Status status, boolean dueBeforeToday)
	{
		int currentYear = Year.now().getValue() + 1;
		Instant dueAt = dueBeforeToday ? Instant.parse("2020-01-26T12:00:00Z") :
				Instant.parse(currentYear + "-01-26T12:00:00Z");
		return createTask(null, status, dueAt);
	}
}