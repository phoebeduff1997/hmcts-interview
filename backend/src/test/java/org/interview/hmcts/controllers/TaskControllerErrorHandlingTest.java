package org.interview.hmcts.controllers;

import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.dtos.UpdateStatusDTO;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.schedulers.OverdueTaskScheduler;
import org.interview.hmcts.services.TaskService;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@WebMvcTest(TaskController.class)
class TaskControllerErrorHandlingTest
{
	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private TaskService taskService;

	@MockitoBean
	private OverdueTaskScheduler overdueTaskScheduler;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@ParameterizedTest
	@MethodSource("invalidCreateTaskScenarios")
	void createTask_shouldReturnCorrectErrors(TaskDTO taskDTO, String invalidField, String invalidMessage) throws Exception
	{
		mockMvc.perform(post(Urls.Task.Post.CREATE_TASK)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(taskDTO))
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.errors[0].field").value(invalidField))
				.andExpect(jsonPath("$.errors[0].message").value(invalidMessage));

	}

	private Stream<Arguments> invalidCreateTaskScenarios()
	{
		return Stream.of(
				Arguments.of(new TaskDTO(1L, null, "description", Status.IN_PROGRESS, Instant.now()), "title", "Title cannot be blank"),
				Arguments.of(new TaskDTO(1L, "title", "description", null, Instant.now()), "status", "Status cannot be null"),
				Arguments.of(new TaskDTO(1L, "title", "description", Status.OVERDUE, Instant.now()), "status", "Status cannot be overdue"),
				Arguments.of(new TaskDTO(1L, "title", "description", Status.IN_PROGRESS, null), "dueAt", "Due at time cannot be null")
		);
	}

	@ParameterizedTest
	@MethodSource("invalidUpdateTaskStatusScenarios")
	void updateTaskStatus_shouldReturnCorrectErrors(UpdateStatusDTO updateStatusDTO, String invalidField, String invalidMessage) throws Exception
	{
		mockMvc.perform(patch(Urls.Task.Patch.UPDATE_STATUS)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(updateStatusDTO))
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.errors[0].field").value(invalidField))
				.andExpect(jsonPath("$.errors[0].message").value(invalidMessage));

	}

	private Stream<Arguments> invalidUpdateTaskStatusScenarios()
	{
		return Stream.of(
				Arguments.of(new UpdateStatusDTO(null, Status.IN_PROGRESS), "id", "Id cannot be null"),
				Arguments.of(new UpdateStatusDTO(1L, null), "status", "Status cannot be null"),
				Arguments.of(new UpdateStatusDTO(1L, Status.OVERDUE), "status", "Status cannot be overdue")
		);
	}

	private String toJson(Object obj) {
		return objectMapper.writeValueAsString(obj);
	}
}