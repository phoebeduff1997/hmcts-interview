package org.interview.hmcts.utils.test;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.enums.Status;

import java.time.Instant;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CreateEntityUtils
{
	public static Task createTask(Long id)
	{
		return createTaskHelper(id, null, null, null, null);
	}

	public static Task createTask(Long id, Status status, Instant dueAt)
	{
		return createTaskHelper(id, null, null, status, dueAt);
	}

	public static Task createTask(Long id, Status status)
	{
		return createTaskHelper(id, null, null, status, null);
	}

	public static TaskDTO createTaskDTO(Long id)
	{
		return createTaskDTOHelper(id, null, null, null, null);
	}

	private static Task createTaskHelper(Long id, String title, String description, Status status, Instant dueAt)
	{
		return Task.builder()
				.id(id)
				.title(!(title == null) ? title : "Title " + id)
				.description(!(description == null) ? description : "Description " + id)
				.status(!(status == null) ? status : Status.COMPLETE)
				.dueAt(!(dueAt == null) ? dueAt : Instant.parse("2026-01-26T12:00:00Z"))
				.build();
	}

	private static TaskDTO createTaskDTOHelper(Long id, String title, String description, Status status, Instant dueAt)
	{
		return TaskDTO.builder()
				.id(id)
				.title(!(title == null) ? title : "Title " + id)
				.description(!(description == null) ? description : "Description " + id)
				.status(!(status == null) ? status : Status.COMPLETE)
				.dueAt(!(dueAt == null) ? dueAt : Instant.parse("2026-01-26T12:00:00Z"))
				.build();
	}
}
