package org.interview.hmcts.controllers;

import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.dtos.UpdateStatusDTO;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.schedulers.OverdueTaskScheduler;
import org.interview.hmcts.services.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import reactor.core.publisher.Sinks;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.interview.hmcts.utils.test.CreateEntityUtils.createTaskDTO;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest
{
	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private TaskService taskService;

	@MockitoBean
	private OverdueTaskScheduler overdueTaskScheduler;

	private TaskDTO task1DTO = createTaskDTO(1L);
	private TaskDTO task2DTO = createTaskDTO(2L);

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Test
	void shouldReturnAllTasksWhenTasksExist() throws Exception
	{
		List<TaskDTO> taskDTOs = Arrays.asList(task1DTO, task2DTO);
		when(taskService.getAllTasks()).thenReturn(taskDTOs);

		ResultActions result = mockMvc.perform(get("/api/task")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(taskDTOs.size()));

		verifyTaskDTOListJsonPaths(taskDTOs, result);
		verify(taskService).getAllTasks();
	}

	@Test
	void shouldReturnEmptyListWhenNoTasks() throws Exception
	{
		when(taskService.getAllTasks()).thenReturn(Collections.emptyList());

		mockMvc.perform(get("/api/task")
					.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().json("[]"));

		verify(taskService).getAllTasks();
	}

	@Test
	void shouldReturnTaskByIdWhenTaskExists() throws Exception
	{
		when(taskService.getTask(task1DTO.getId())).thenReturn(task1DTO);

		ResultActions result = mockMvc.perform(get("/api/task/{id}", task1DTO.getId())
					.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));

		verifyTaskDTOJsonPaths(task1DTO, result);
		verify(taskService).getTask(task1DTO.getId());
	}

	@Test
	void shouldReturnStreamOfRecentlyOverdueTasks() throws Exception
	{
		Sinks.Many<List<TaskDTO>> sink = Sinks.many().replay().all();
		when(overdueTaskScheduler.getTaskUpdateSink()).thenReturn(sink);

		List<TaskDTO> taskDTOS = Arrays.asList(task1DTO);

		sink.tryEmitNext(taskDTOS);

		mockMvc.perform(get("/api/task/overdue")
						.accept(MediaType.TEXT_EVENT_STREAM))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_EVENT_STREAM))
				.andExpectAll(
						content().string(containsString(task1DTO.getId().toString())),
						content().string(containsString(task1DTO.getTitle())),
						content().string(containsString(task1DTO.getDescription())),
						content().string(containsString(task1DTO.getStatus().toString())),
						content().string(containsString(task1DTO.getDueAt().toString()))
				);

		verify(overdueTaskScheduler).getTaskUpdateSink();
	}

	@Test
	void shouldReturnTaskWhenCreated() throws Exception
	{
		String json = toJson(task1DTO);

		when(taskService.createTask(task1DTO)).thenReturn(task1DTO);

		ResultActions result = mockMvc.perform(post("/api/task")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));

		verifyTaskDTOJsonPaths(task1DTO, result);
		verify(taskService).createTask(task1DTO);
	}

	@Test
	void shouldReturnTaskWhenStatusUpdated() throws Exception
	{
		UpdateStatusDTO updateStatusDTO = new UpdateStatusDTO(task1DTO.getId(), Status.COMPLETE);
		String json = toJson(updateStatusDTO);

		when(taskService.updateTaskStatus(updateStatusDTO)).thenReturn(task1DTO);

		ResultActions result = mockMvc.perform(patch("/api/task/status")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));

		verifyTaskDTOJsonPaths(task1DTO, result);
		verify(taskService).updateTaskStatus(updateStatusDTO);
	}

	@Test
	void shouldReturnNoContentWhenTaskDeleted() throws Exception
	{
		mockMvc.perform(delete("/api/task/{id}", task1DTO.getId())
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNoContent());

		verify(taskService).deleteTask(task1DTO.getId());
	}

	private String toJson(Object obj) {
		return objectMapper.writeValueAsString(obj);
	}

	private void verifyTaskDTOJsonPaths(TaskDTO taskDTO, ResultActions result) throws Exception
	{
		result.andExpect(jsonPath("$.id").value(taskDTO.getId()))
				.andExpect(jsonPath("$.title").value(taskDTO.getTitle()))
				.andExpect(jsonPath("$.description").value(taskDTO.getDescription()))
				.andExpect(jsonPath("$.status").value(taskDTO.getStatus().toString()))
				.andExpect(jsonPath("$.dueAt").value(taskDTO.getDueAt().toString()));
	}

	private void verifyTaskDTOJsonPaths(TaskDTO taskDTO, ResultActions result, int jsonPosition) throws Exception
	{
		result.andExpect(jsonPath("$[" + jsonPosition + "].id").value(taskDTO.getId()))
				.andExpect(jsonPath("$[" + jsonPosition + "].title").value(taskDTO.getTitle()))
				.andExpect(jsonPath("$[" + jsonPosition + "].description").value(taskDTO.getDescription()))
				.andExpect(jsonPath("$[" + jsonPosition + "].status").value(taskDTO.getStatus().toString()))
				.andExpect(jsonPath("$[" + jsonPosition + "].dueAt").value(taskDTO.getDueAt().toString()));
	}

	private void verifyTaskDTOListJsonPaths(List<TaskDTO> taskDTOs, ResultActions result) throws Exception
	{
		for (int i = 0; i < taskDTOs.size(); i++)
		{
			verifyTaskDTOJsonPaths(taskDTOs.get(i), result, i);
		}
	}
}