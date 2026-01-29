package org.interview.hmcts.schedulers;

import jakarta.annotation.PreDestroy;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.converters.TaskDTOConverter;
import org.interview.hmcts.entities.dtos.TaskDTO;
import org.interview.hmcts.repositories.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Sinks;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Component
public class OverdueTaskScheduler
{
	private final TaskRepository taskRepository;
	private final Sinks.Many<List<TaskDTO>> taskUpdateSink = Sinks.many().multicast().directBestEffort();

	public Sinks.Many<List<TaskDTO>> getTaskUpdateSink() {
		return taskUpdateSink;
	}

	@Scheduled(fixedRate = 60 * 1000)
	public void updateOverdueTasks()
	{
		List<TaskDTO> updatedOverdueTasks = taskRepository.updateAndReturnOverdueTasks()
				.stream()
				.map(task -> TaskDTOConverter.toDTO(task))
				.collect(Collectors.toUnmodifiableList());
		if(!updatedOverdueTasks.isEmpty())
		{
			taskUpdateSink.tryEmitNext(updatedOverdueTasks);
			System.out.println("Updated: " + updatedOverdueTasks.size());
		}
	}

	@PreDestroy
	public void shutdown() {
		taskUpdateSink.tryEmitComplete();
	}
}
