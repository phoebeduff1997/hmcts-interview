package org.interview.hmcts.repositories;

import jakarta.transaction.Transactional;
import org.interview.hmcts.entities.Task;
import org.interview.hmcts.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>
{
	@Query("SELECT t FROM Task t " +
			"WHERE t.status NOT IN ('COMPLETE', 'OVERDUE') " +
			"AND t.dueAt < CURRENT_TIMESTAMP")
	List<Task> findTasksToUpdateToOverdue();

	@Transactional
	default List<Task> updateAndReturnOverdueTasks()
	{
		List<Task> tasksToUpdateToOverdue = findTasksToUpdateToOverdue();
		tasksToUpdateToOverdue.forEach(task -> task.setStatus(Status.OVERDUE));
		return saveAll(tasksToUpdateToOverdue);
	}
}
