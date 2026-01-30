import {ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {DisplayStringEnumValuesPipe} from '../pipes/display-string-enum-values.pipe';
import {Status, statusArray} from '../models/enums/status.model';
import {TitleCasePipe} from '@angular/common';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {Task} from '../models/task.model';
import {TaskService} from '../services/task.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTooltip} from '@angular/material/tooltip';
import {NotificationService} from '../../shared/services/notification.service';

@Component({
    selector: 'app-create-task-dialog',
    imports: [
        MatDialogActions,
        MatIcon,
        MatDialogClose,
        MatIconButton,
        MatDialogTitle,
        MatDialogContent,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatSelect,
        DisplayStringEnumValuesPipe,
        MatOption,
        MatDatepickerInput,
        FormsModule,
        MatDatepicker,
        MatDatepickerToggle,
        MatTimepickerInput,
        MatTimepicker,
        MatTimepickerToggle,
        MatSuffix,
        MatButton,
        MatTooltip
    ],
    providers: [
        TitleCasePipe,
        provideNativeDateAdapter()
    ],
    templateUrl: './create-task-dialog.component.html',
    styleUrl: './create-task-dialog.component.scss',
})
export class CreateTaskDialogComponent {

    newTaskForm = this.createFormGroup();
    displayError: boolean = false;
    protected readonly statusArray = statusArray;

    private destroyRef = inject(DestroyRef);
    private changeDetectorRef = inject(ChangeDetectorRef);

    constructor(private dialogRef: MatDialogRef<CreateTaskDialogComponent>, private taskService: TaskService,
                private notificationService: NotificationService) {}

    public saveTask(): void {
        this.taskService.createTask(this.createTask(this.newTaskForm.value))
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: value => {
                this.notificationService.showSuccessNotification('Task created');
                this.dialogRef.close(value);
            },
            error: err => {
                this.displayError = true;
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    private createTask(values: any): Task {
        return {
            title: values.title,
            description: values.description,
            status: values.status,
            dueAt: values.dueAt
        } as Task;
    }

    private createFormGroup(): FormGroup {
        return new FormGroup({
            title: new FormControl<string>('', [Validators.required]),
            description: new FormControl<string | null>(''),
            status: new FormControl<Status>(Status.NOT_STARTED, [Validators.required]),
            dueAt: new FormControl<Date>(new Date(), [Validators.required])
        });
    }


}
