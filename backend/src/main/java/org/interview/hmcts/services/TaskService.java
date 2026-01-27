package org.interview.hmcts.services;

import lombok.AllArgsConstructor;
import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.converters.TaskDTOConverter;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.entities.dtos.UpdateStatusDTO;
import org.interview.hmcts.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskService
{
	private final TaskRepository taskRepository;

	public List<TaskDTO> getAllTasks()
	{
		return taskRepository.findAll()
				.stream()
				.map(task -> TaskDTOConverter.toDTO(task))
				.collect(Collectors.toList());
	}

	public TaskDTO getTask(Long id)
	{
		return TaskDTOConverter.toDTO(taskRepository.getReferenceById(id));
	}

	public TaskDTO createTask(TaskDTO taskDTO)
	{
		Task task = TaskDTOConverter.toEntity(taskDTO);
		return TaskDTOConverter.toDTO(taskRepository.save(task));
	}

	public TaskDTO updateTaskStatus(UpdateStatusDTO updateStatusDTO)
	{
		Task taskToUpdate = taskRepository.getReferenceById(updateStatusDTO.getId());
		taskToUpdate.setStatus(updateStatusDTO.getStatus());
		return TaskDTOConverter.toDTO(taskRepository.save(taskToUpdate));
	}

	public void deleteTask(Long id)
	{
		taskRepository.deleteById(id);
	}
}
