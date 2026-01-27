package org.interview.hmcts.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.interview.hmcts.entities.enums.Status;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
	indexes = {
		@Index(name = "idx_status_due", columnList = "status, dueAt")
	}
)
public class Task
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long id;

	@NotNull
	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "CLOB")
	private String description;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status;

	@NotNull
	@Column(name = "due_at", nullable = false)
	private Instant dueAt;

}
