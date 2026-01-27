package org.interview.hmcts.entities.converters;

import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.dtos.TaskDTO;

public class TaskDTOConverter
{
	public static TaskDTO toDTO(Task task)
	{
		return TaskDTO.builder()
				.id(task.getId())
				.title(task.getTitle())
				.description(task.getDescription())
				.status(task.getStatus())
				.dueAt(task.getDueAt())
				.build();
	}

	public static Task toEntity(TaskDTO taskDTO)
	{
		return Task.builder()
				.id(taskDTO.getId())
				.title(taskDTO.getTitle())
				.description(taskDTO.getDescription())
				.status(taskDTO.getStatus())
				.dueAt(taskDTO.getDueAt())
				.build();
	}
}
