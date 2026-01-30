package org.interview.hmcts.services;

import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.converters.TaskDTOConverter;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.dtos.UpdateStatusDTO;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.repositories.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static org.interview.hmcts.utils.test.AssertionUtils.assertTaskDTOsEqual;
import static org.interview.hmcts.utils.test.CreateEntityUtils.createTask;
import static org.interview.hmcts.utils.test.CreateEntityUtils.createTaskDTO;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest
{
	@Mock
	TaskRepository taskRepository;

	@InjectMocks
	TaskService taskService;

	@Test
	void getTask_shouldReturnTaskById()
	{
		TaskDTO taskDTO = createTaskDTO(1L);
		Task task = TaskDTOConverter.toEntity(taskDTO);

		when(taskRepository.getReferenceById(taskDTO.getId())).thenReturn(task);

		TaskDTO returnedTaskDTO = taskService.getTask(taskDTO.getId());

		assertTaskDTOsEqual(taskDTO, returnedTaskDTO);
		verify(taskRepository).getReferenceById(taskDTO.getId());
	}

	@Test
	void getAllTasks_shouldReturnAllTasks()
	{
		List<TaskDTO> taskDTOs = Arrays.asList(createTaskDTO(1L), createTaskDTO(2L));
		List<Task> tasks = taskDTOs.stream()
				.map(taskDTO -> TaskDTOConverter.toEntity(taskDTO))
				.collect(Collectors.toList());

		when(taskRepository.findAll()).thenReturn(tasks);

		List<TaskDTO> returnedTaskDTOs = taskService.getAllTasks();

		assertFalse(returnedTaskDTOs.isEmpty());
		assertEquals(taskDTOs.size(), returnedTaskDTOs.size());
		for(int i = 0; i < returnedTaskDTOs.size(); i++)
		{
			assertTaskDTOsEqual(taskDTOs.get(i), returnedTaskDTOs.get(i));
		}
		verify(taskRepository).findAll();
	}

	@Test
	void getAllTasks_shouldReturnEmptyListWhenNoTasks()
	{
		when(taskRepository.findAll()).thenReturn(Collections.emptyList());

		List<TaskDTO> returnedTaskDTOs = taskService.getAllTasks();

		assertTrue(returnedTaskDTOs.isEmpty());
		verify(taskRepository).findAll();
	}

	@Test
	void createTask_shouldReturnCreatedTask()
	{
		TaskDTO taskDTO = createTaskDTO(1L);
		Task task = TaskDTOConverter.toEntity(taskDTO);

		when(taskRepository.save(any(Task.class))).thenReturn(task);

		TaskDTO returnedTaskDTO = taskService.createTask(taskDTO);

		assertTaskDTOsEqual(taskDTO, returnedTaskDTO);
		verify(taskRepository).save(any(Task.class));
	}

	@Test
	void updateTaskStatus_shouldReturnTaskWithUpdatedStatus()
	{
		Status originalStatus = Status.NOT_STARTED;
		Status newStatus  = Status.IN_PROGRESS;
		UpdateStatusDTO updateStatusDTO = new UpdateStatusDTO(1L, newStatus);
		Task taskOldStatus = createTask(1L, originalStatus);
		Task taskNewStatus = createTask(1L, newStatus);

		when(taskRepository.getReferenceById(updateStatusDTO.getId())).thenReturn(taskOldStatus);
		when(taskRepository.save(any(Task.class))).thenReturn(taskNewStatus);

		TaskDTO returnedTaskDTO = taskService.updateTaskStatus(updateStatusDTO);

		assertNotEquals(originalStatus, returnedTaskDTO.getStatus());
		assertTaskDTOsEqual(TaskDTOConverter.toDTO(taskNewStatus), returnedTaskDTO);
		verify(taskRepository).getReferenceById(updateStatusDTO.getId());
		verify(taskRepository).save(any(Task.class));
	}

	@Test
	void deleteTask_shouldCallTheRepository()
	{
		taskService.deleteTask(1L);

		verify(taskRepository).deleteById(1L);
	}
}