import {TaskService} from './task.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {Task} from '../models/task.model';
import {HmctsModelApi} from '../../hmcts-model.api';
import {Status} from '../models/enums/status.model';
import {UpdateTaskStatus} from '../models/update-task-status.model';

describe('TaskService', () => {
    let taskService: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                TaskService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        taskService = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create', () => {
        expect(taskService).toBeTruthy();
    });

    describe('getTasks', () => {
        it('should get all tasks', () => {
            const mockTasks: Task[] = [createTask()];

            taskService.getTasks().subscribe(tasks => {
                expect(tasks).toEqual(mockTasks);
            });

            const request = httpMock.expectOne(HmctsModelApi.Task.get.getAllTasks);
            expect(request.request.method).toBe('GET');
            request.flush(mockTasks);
        });
    });

    describe('getTask', () => {
        it('should get task by id', () => {
            const mockTask: Task = createTask();

            taskService.getTask(1).subscribe(task => {
                expect(task).toEqual(mockTask);
            });

            const request = httpMock.expectOne(`${HmctsModelApi.Task.get.getTask}/1`);
            expect(request.request.method).toBe('GET');
            request.flush(mockTask);
        });
    });

    describe('createTask', () => {
        it('should create a task', () => {
            const mockTask: Task = createTask();

            taskService.createTask(mockTask).subscribe(task => {
                expect(task).toEqual(mockTask);
            });

            const request = httpMock.expectOne(HmctsModelApi.Task.post.createTask);
            expect(request.request.method).toBe('POST');
            request.flush(mockTask);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', () => {
            taskService.deleteTask(1).subscribe(response => {
                expect(response).toBeNull();
            });

            const request = httpMock.expectOne(`${HmctsModelApi.Task.delete.deleteTask}/1`);
            expect(request.request.method).toBe('DELETE');
            request.flush(null);
        });
    });

    describe('updateTaskStatus', () => {
        it('should delete a task', () => {
            const update: UpdateTaskStatus = { id: 1 } as UpdateTaskStatus;
            const updatedTask: Task = { id: 1 } as Task;

            taskService.updateTaskStatus(update).subscribe(task => {
                expect(task).toEqual(updatedTask);
            });

            const request = httpMock.expectOne(HmctsModelApi.Task.patch.updateTaskStatus);
            expect(request.request.method).toBe('PATCH');
            expect(request.request.body).toEqual(update);
            request.flush(updatedTask);
        });
    });

    describe('streamRecentlyOverdueTasks', () => {
        let mockEventSource: any;

        beforeEach(() => {
            mockEventSource = {
                onmessage: null,
                onerror: null,
                close: jasmine.createSpy('close')
            };

            spyOn(console, 'log').and.callFake(() => {});
            spyOn(window as any, 'EventSource').and.returnValue(mockEventSource);
        });

        it('should emit tasks on message', () => {
            const mockTasks: Task[] = [{ id: 1 } as Task];
            const received: Task[][] = [];

            const subscription = taskService.streamRecentlyOverdueTasks().subscribe(tasks => {
                received.push(tasks);
            });

            mockEventSource.onmessage({
                data: JSON.stringify(mockTasks)
            });

            expect(received.length).toBe(1);
            expect(received[0]).toEqual(mockTasks);

            subscription.unsubscribe();
            expect(mockEventSource.close).toHaveBeenCalled();
        });

        it('should complete and close on error', () => {
            const completeSpy = jasmine.createSpy('complete');

            taskService.streamRecentlyOverdueTasks().subscribe({
                complete: completeSpy
            });

            mockEventSource.onerror('error');

            expect(mockEventSource.close).toHaveBeenCalled();
            expect(completeSpy).toHaveBeenCalled();
        });
    });

    function createTask(): Task {
        return {
            id: 1,
            title: 'title',
            description: 'description',
            status: Status.IN_PROGRESS,
            dueAt: new Date()
        } as Task;
    }
});
