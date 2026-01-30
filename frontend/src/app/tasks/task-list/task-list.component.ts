import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Task} from '../models/task.model';
import {TaskService} from '../services/task.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    MatDivider,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemLine,
    MatListItemMeta,
    MatListItemTitle
} from '@angular/material/list';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {DisplayStringEnumValuesPipe} from '../pipes/display-string-enum-values.pipe';
import {StatusToIconPipe} from '../pipes/status-to-icon.pipe';
import {DueAtColourDirective} from '../directives/due-at-colour.directive';
import {MatDialog} from '@angular/material/dialog';
import {CreateTaskDialogComponent} from '../create-task-dialog/create-task-dialog.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {Status, statusArrayOptionalOverdue} from '../models/enums/status.model';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {UpdateTaskStatus} from '../models/update-task-status.model';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-task-list',
    imports: [
        MatList,
        MatListItem,
        MatListItemTitle,
        MatListItemLine,
        DatePipe,
        MatDivider,
        MatToolbar,
        MatIcon,
        MatIconButton,
        MatListItemMeta,
        MatListItemIcon,
        StatusToIconPipe,
        DueAtColourDirective,
        DisplayStringEnumValuesPipe,
        MatOption,
        MatSelect,
        MatFormField,
        MatLabel,
        MatTooltip,
        RouterLink
    ],
    providers: [
        TitleCasePipe
    ],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

    tasks: WritableSignal<Task[]> = signal<Task[]>([]);

    private destroyRef = inject(DestroyRef);
    protected readonly statusArrayOptionalOverdue = statusArrayOptionalOverdue;

    constructor(private taskService: TaskService, private matIconReg: MatIconRegistry, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
        this.taskService.getTasks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: value => {
                this.tasks.set(value);
            }
        });

        this.taskService.streamRecentlyOverdueTasks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: updatedTasks => {
                const currentTasks = this.tasks();
                updatedTasks.forEach(updatedTask => {
                    const index = currentTasks.findIndex(task => task.id === updatedTask.id);
                    currentTasks[index] = updatedTask;
                });
                this.tasks.set([...currentTasks]);
            }
        });
    }

    openCreateTaskDialog(): void {
        this.dialog.open(CreateTaskDialogComponent, {
            width:"80vw",
            height:"80vh",
            disableClose: true
        }).afterClosed().subscribe({
            next: newTask => {
                if(newTask) {
                    this.tasks.update(existingTasks => [...existingTasks, newTask]);
                }
            }
        });
    }

    openConfirmationDialog(task: Task): void {
        this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
                title: 'Delete ' + task.title + '?',
                message: 'Are you sure you want to delete this task?',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                isCancelConfirmation: true
            }
        }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
            if(result === true) {
                this.taskService.deleteTask(task.id).pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: value => {
                            const updatedTaskList: Task[] = this.tasks().filter(taskToFilter => taskToFilter.id !== task.id);
                            this.tasks.update(existingTasks => updatedTaskList);
                        }
                    });
            }
        });
    }

    updateTaskStatus(id: number, status: string) {
        this.taskService.updateTaskStatus(this.createUpdateTaskStatus(id, status as Status))
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: value => {
                    const updatedTaskList: Task[] = this.tasks().map(task => task.id === value.id ? value : task);
                    this.tasks.update(existingTasks => updatedTaskList);
                }
        });
    }

    private createUpdateTaskStatus(id: number, status: Status): UpdateTaskStatus {
        return {
            id,
            status
        } as UpdateTaskStatus;
    }

}
