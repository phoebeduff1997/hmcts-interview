package org.interview.hmcts.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.interview.hmcts.entities.enums.Status;
import org.interview.hmcts.validators.ValidStatus;

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

	@NotNull(message = "Title cannot be null")
	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "CLOB")
	private String description;

	@NotNull(message = "Status cannot be null")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status;

	@NotNull@NotNull(message = "Due at time cannot be null")
	@Column(name = "due_at", nullable = false)
	private Instant dueAt;

}
