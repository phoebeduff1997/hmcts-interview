import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TaskService} from '../services/task.service';
import {Task} from '../models/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    MatCard, MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from '@angular/material/card';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MatListItemIcon} from '@angular/material/list';
import {StatusToIconPipe} from '../pipes/status-to-icon.pipe';
import {DueAtColourDirective} from '../directives/due-at-colour.directive';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {DisplayStringEnumValuesPipe} from '../pipes/display-string-enum-values.pipe';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-display-task',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardAvatar,
        MatIcon,
        MatListItemIcon,
        StatusToIconPipe,
        DueAtColourDirective,
        MatCardTitle,
        MatCardSubtitle,
        DatePipe,
        MatCardContent,
        MatCardActions,
        DisplayStringEnumValuesPipe,
        MatTooltip,
        MatButton
    ],
    providers: [
        TitleCasePipe
    ],
    templateUrl: './display-task.component.html',
    styleUrl: './display-task.component.scss'
})
export class DisplayTaskComponent implements OnInit {

    task: WritableSignal<Task> = signal<Task>({} as Task);

    private destroyRef = inject(DestroyRef);

    constructor(private taskService: TaskService, private route: ActivatedRoute, private matIconReg: MatIconRegistry,
                private router: Router) {}

    ngOnInit() {
        this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
        let id = this.route.snapshot.params['id'];
        this.taskService.getTask(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: value => {
                this.task.set(value);
            }
        });

    }

    returnToTasks(): void {
        this.router.navigate(['/tasks']);
    }
}
