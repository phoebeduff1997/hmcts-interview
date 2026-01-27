package org.interview.hmcts.schedulers;

import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.repositories.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.interview.hmcts.utils.test.CreateEntityUtils.createTask;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OverdueTaskSchedulerTest {

	@Mock
	private TaskRepository taskRepository;

	private OverdueTaskScheduler scheduler;

	@BeforeEach
	void setUp()
	{
		scheduler = new OverdueTaskScheduler(taskRepository);
	}

	@Test
	void updateOverdueTasks_shouldEmitUpdatedTasksWhenOverdueTasksExist()
	{
		Task task1 = createTask(1L);
		Task task2 = createTask(2L);

		when(taskRepository.updateAndReturnOverdueTasks()).thenReturn(List.of(task1, task2));

		List<List<TaskDTO>> updatedOverdueTasks = new CopyOnWriteArrayList<>();

		scheduler.getTaskUpdateSink()
				.asFlux()
				.subscribe(updatedOverdueTasks::add);

		scheduler.updateOverdueTasks();

		verify(taskRepository).updateAndReturnOverdueTasks();
		assertThat(updatedOverdueTasks).hasSize(1);
		assertThat(updatedOverdueTasks.get(0)).hasSize(2);
		assertTaskValues(task1, updatedOverdueTasks.get(0).get(0));
		assertTaskValues(task2, updatedOverdueTasks.get(0).get(1));
	}

	@Test
	void updateOverdueTasks_shouldNotEmitWhenNoOverdueTasksExist()
	{
		when(taskRepository.updateAndReturnOverdueTasks()).thenReturn(List.of());

		List<List<TaskDTO>> updatedOverdueTasks = new CopyOnWriteArrayList<>();

		scheduler.getTaskUpdateSink()
				.asFlux()
				.subscribe(updatedOverdueTasks::add);

		scheduler.updateOverdueTasks();

		verify(taskRepository).updateAndReturnOverdueTasks();
		assertThat(updatedOverdueTasks).isEmpty();
	}

	private void assertTaskValues(Task expectedTask, TaskDTO actualTask)
	{
		assertAll(
				() -> assertEquals(expectedTask.getId(), actualTask.getId()),
				() -> assertEquals(expectedTask.getTitle(), actualTask.getTitle()),
				() -> assertEquals(expectedTask.getDescription(), actualTask.getDescription()),
				() -> assertEquals(expectedTask.getStatus(), actualTask.getStatus()),
				() -> assertEquals(expectedTask.getDueAt(), actualTask.getDueAt())
		);
	}
}