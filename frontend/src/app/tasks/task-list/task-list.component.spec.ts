import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskListComponent} from './task-list.component';
import {TaskService} from '../services/task.service';
import {of} from 'rxjs';
import {Task} from '../models/task.model';
import {Status} from '../models/enums/status.model';
import {provideRouter} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CreateTaskDialogComponent} from '../create-task-dialog/create-task-dialog.component';
import {UpdateTaskStatus} from '../models/update-task-status.model';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';

describe('TaskList', () => {
    const taskData: Task[] = [createTask(33)];

    let component: TaskListComponent;
    let fixture: ComponentFixture<TaskListComponent>;
    let mockTaskService: jasmine.SpyObj<TaskService>;
    let mockDialog: jasmine.SpyObj<MatDialog>

    beforeEach(async () => {
        mockTaskService = jasmine.createSpyObj<TaskService>('TaskService', ['getTasks',
            'streamRecentlyOverdueTasks', 'deleteTask', 'updateTaskStatus']);
        mockTaskService.getTasks.and.returnValue(of(taskData));
        mockTaskService.streamRecentlyOverdueTasks.and.returnValue(of(taskData));

        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                TaskListComponent
            ],
            providers: [
                { provide: TaskService, useValue: mockTaskService },
                { provide: MatDialog, useValue: mockDialog },
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
       it('should update tasks on load', () => {
           mockTaskService.getTasks.and.returnValue(of([createTask(1), createTask(2)]));
           component.ngOnInit();
           fixture.detectChanges();

           expect(component.tasks().length).toEqual(2);
       });

        it('should update tasks that have become overdue', () => {
            mockTaskService.getTasks.and.returnValue(of([createTask(1), createTask(2)]));
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.tasks().length).toEqual(2);
            expect(component.tasks()[0].status).toEqual(Status.NOT_STARTED);

            mockTaskService.streamRecentlyOverdueTasks.and.returnValue(of([createTask(1, Status.OVERDUE)]));
            component.ngOnInit();
            fixture.detectChanges();

            expect(component.tasks().length).toEqual(2);
            expect(component.tasks()[0].status).toEqual(Status.OVERDUE);
        });
    });

    describe('openCreateTaskDialog', () => {
        it('should open create task dialog with correct config', () => {
            mockDialogClose(false);

            component.openCreateTaskDialog();

            expect(mockDialog.open).toHaveBeenCalledWith(
                CreateTaskDialogComponent,
                jasmine.objectContaining({
                    disableClose: true
                })
            );
        });

        it('should not add a task when dialog is cancelled', () => {
            mockDialogClose(false);

            component.openCreateTaskDialog();

            expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
            expect(component.tasks().length).toBe(1);
        });

        it('should add task when dialog is confirmed', () => {
            mockDialogClose(createTask(1));

            component.openCreateTaskDialog();

            expect(component.tasks().length).toBe(2);
            expect(component.tasks()[1].id).toEqual(1);
        });
    });

    describe('openConfirmationDialog', () => {
        it('should open confirmation dialog with correct config', () => {
            mockDialogClose(false);

            component.openConfirmationDialog(createTask(1));

            expect(mockDialog.open).toHaveBeenCalledWith(
                ConfirmDialogComponent,
                jasmine.objectContaining({
                    disableClose: true,
                    data: jasmine.objectContaining({
                        title: 'Delete test title?',
                        confirmButtonText: 'Delete',
                        cancelButtonText: 'Cancel',
                        isCancelConfirmation: true
                    })
                })
            );
        });

        it('should not delete task when dialog is cancelled', () => {
            mockDialogClose(false);

            component.openConfirmationDialog(createTask(1));

            expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
            expect(component.tasks().length).toBe(1);
        });

        it('should delete task when dialog is confirmed', () => {
            mockDialogClose(true);
            mockTaskService.deleteTask.and.returnValue(of(void 0));

            component.openConfirmationDialog(createTask(33));

            expect(mockTaskService.deleteTask).toHaveBeenCalledWith(33);
            expect(component.tasks()).toEqual([]);
        });
    });

    describe('updateTaskStatus', () => {
        it('should update the task with the returned value', () => {
            setUpUpdateTaskStatusTests()

            expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith({id: 1, status: Status.COMPLETE} as UpdateTaskStatus);
            expect(component.tasks().length).toBe(2);
            expect(component.tasks()[1].status).toBe(Status.COMPLETE);
        });

        it('should not update the task when selected status is same as current status', () => {
            component.updateTaskStatus(33, Status.NOT_STARTED);

            expect(mockTaskService.updateTaskStatus).not.toHaveBeenCalled();
        })

        it('should not affect other tasks', () => {
            setUpUpdateTaskStatusTests();

            expect(component.tasks().length).toBe(2);
            expect(component.tasks()[0].status).toBe(Status.NOT_STARTED);
        });

        function setUpUpdateTaskStatusTests(): void {
            component.tasks.update(existingTasks => [...existingTasks, createTask(1)])
            expect(component.tasks().length).toEqual(2);

            mockTaskService.updateTaskStatus.and.returnValue(of(createTask(1, Status.COMPLETE)));
            component.updateTaskStatus(1, Status.COMPLETE);
        }
    });

    function createTask(id: number, status?: Status): Task {
        return {
            id,
            title: 'test title',
            description: 'test description',
            status: status ? status : Status.NOT_STARTED,
            dueAt: new Date()
        } as Task;
    }

    function mockDialogClose(result: boolean | Task | undefined) {
        mockDialog.open.and.returnValue({
            afterClosed: () => of(result)
        } as any);
    }
});
