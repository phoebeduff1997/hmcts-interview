package org.interview.hmcts.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class TaskService
{
	private final TaskRepository taskRepository;

	public List<TaskDTO> getAllTasks()
	{
		log.info("Getting all tasks");
		return taskRepository.findAll()
				.stream()
				.map(task -> TaskDTOConverter.toDTO(task))
				.collect(Collectors.toList());
	}

	public TaskDTO getTask(Long id)
	{
		log.info("Getting task with id: {}", id);
		return TaskDTOConverter.toDTO(taskRepository.getReferenceById(id));
	}

	public TaskDTO createTask(TaskDTO taskDTO)
	{
		log.info("Creating task with title: {}", taskDTO.getTitle());
		Task task = TaskDTOConverter.toEntity(taskDTO);
		return TaskDTOConverter.toDTO(taskRepository.save(task));
	}

	public TaskDTO updateTaskStatus(UpdateStatusDTO updateStatusDTO)
	{
		log.info("Updating status of task with id {} to {}", updateStatusDTO.getId(), updateStatusDTO.getStatus());
		Task taskToUpdate = taskRepository.getReferenceById(updateStatusDTO.getId());
		taskToUpdate.setStatus(updateStatusDTO.getStatus());
		return TaskDTOConverter.toDTO(taskRepository.save(taskToUpdate));
	}

	public void deleteTask(Long id)
	{
		log.info("Deleting task with id: {}", id);
		taskRepository.deleteById(id);
	}
}
