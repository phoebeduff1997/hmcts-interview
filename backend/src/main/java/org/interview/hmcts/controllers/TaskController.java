package org.interview.hmcts.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.dtos.UpdateStatusDTO;
import org.interview.hmcts.schedulers.OverdueTaskScheduler;
import org.interview.hmcts.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

@AllArgsConstructor
@RestController
public class TaskController
{
	private final TaskService taskService;
	private final OverdueTaskScheduler overdueTaskScheduler;

	@GetMapping(Urls.Task.Get.GET_ALL_TASKS)
	public ResponseEntity<List<TaskDTO>> getTasks()
	{
		return ResponseEntity.ok(taskService.getAllTasks());
	}

	@GetMapping(Urls.Task.Get.GET_TASK)
	public ResponseEntity<TaskDTO> getTask(@PathVariable("id") Long id)
	{
		return ResponseEntity.ok(taskService.getTask(id));
	}

	@GetMapping(value = Urls.Task.Get.GET_ALL_RECENTLY_OVERDUE_TASKS, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<List<TaskDTO>> streamRecentlyOverdueTasks()
	{
		return overdueTaskScheduler.getTaskUpdateSink().asFlux();
	}

	@PostMapping(Urls.Task.Post.CREATE_TASK)
	public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO)
	{
		TaskDTO createdTaskDTO = taskService.createTask(taskDTO);
		return ResponseEntity
				.status(HttpStatus.CREATED)
				.contentType(MediaType.APPLICATION_JSON)
				.body(createdTaskDTO);
	}

	@PatchMapping(Urls.Task.Patch.UPDATE_STATUS)
	public ResponseEntity<TaskDTO> updateTaskStatus(@Valid @RequestBody UpdateStatusDTO updateStatusDTO)
	{
		return ResponseEntity.ok(taskService.updateTaskStatus(updateStatusDTO));
	}

	@DeleteMapping(Urls.Task.Delete.DELETE_TASK)
	public ResponseEntity<Void> deleteTask(@PathVariable("id") Long id)
	{
		taskService.deleteTask(id);
		return ResponseEntity.noContent().build();
	}
}
