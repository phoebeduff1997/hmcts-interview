import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateTaskDialogComponent} from './create-task-dialog.component';
import {Status} from '../models/enums/status.model';
import {MatDialogRef} from '@angular/material/dialog';
import {Task} from '../models/task.model';
import {TaskService} from '../services/task.service';
import {of} from 'rxjs';

describe('CreateTaskDialogComponent', () => {

    let component: CreateTaskDialogComponent;
    let fixture: ComponentFixture<CreateTaskDialogComponent>;
    let mockDialog: jasmine.SpyObj<MatDialogRef<CreateTaskDialogComponent, Task>>;
    let mockTaskService: jasmine.SpyObj<TaskService>;

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialogRef', ['close']);
        mockTaskService = jasmine.createSpyObj<TaskService>('TaskService', ['createTask']);

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                CreateTaskDialogComponent
            ],
            providers: [
                { provide: TaskService, useValue: mockTaskService },
                { provide: MatDialogRef, useValue: mockDialog }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateTaskDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('createFormGroup', () => {
        it('should create correct form group on load', () => {
            const formControlIdentifiers: string[] = Object.keys(component.newTaskForm.controls);

            expect(formControlIdentifiers.length).toEqual(4);
            expect(formControlIdentifiers.indexOf('title') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('description') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('status') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('dueAt') > -1).toBeTrue();
        });

        it('should have correct validation for title', () => {
            expect(component.newTaskForm.controls['title'].valid).toBeFalse();
            component.newTaskForm.controls['title'].setValue('test title value');
            expect(component.newTaskForm.controls['title'].valid).toBeTrue();
        });

        it('should have correct validation for description', () => {
            expect(component.newTaskForm.controls['description'].valid).toBeTrue();
            component.newTaskForm.controls['description'].setValue('test description value');
            expect(component.newTaskForm.controls['description'].valid).toBeTrue();
        });

        it('should have correct validation for status', () => {
            expect(component.newTaskForm.controls['status'].value).toBe(Status.NOT_STARTED);
            expect(component.newTaskForm.controls['status'].valid).toBeTrue();

            component.newTaskForm.controls['status'].setValue(Status.COMPLETE);
            expect(component.newTaskForm.controls['status'].valid).toBeTrue();
        });

        it('should have correct validation for dueAt', () => {
            expect(component.newTaskForm.controls['dueAt'].value).toBeInstanceOf(Date);
            expect(component.newTaskForm.controls['dueAt'].valid).toBeTrue();

            component.newTaskForm.controls['dueAt'].setValue(new Date());
            expect(component.newTaskForm.controls['dueAt'].valid).toBeTrue();
        });

        it('should have invalid form if field invalid', () => {
            expect(component.newTaskForm.valid).toBeFalse();
        });

        it('should have valid form if all fields valid', () => {
            component.newTaskForm.controls['title'].setValue('test title value');
            expect(component.newTaskForm.valid).toBeTrue();
        });
    });

    describe('saveTask', () => {
        it('should save and close with the correct value', () => {
            const currentDate = new Date();
            setUpValidForm(currentDate);
            const sentTask: Task = createTestTask(currentDate);
            const recievedTask: Task = createTestTask(currentDate, 1);
            mockTaskService.createTask.and.returnValue(of(recievedTask));

            component.saveTask();

            expect(mockTaskService.createTask).toHaveBeenCalledWith(sentTask);
            expect(mockDialog.close).toHaveBeenCalledWith(recievedTask);

        });

        function setUpValidForm(date: Date): void {
            component.newTaskForm.controls['title'].setValue('test title value');
            component.newTaskForm.controls['description'].setValue('test description value');
            component.newTaskForm.controls['status'].setValue(Status.COMPLETE);
            component.newTaskForm.controls['dueAt'].setValue(date);
        }

        function createTestTask(date: Date, id?: number): Task {
            let task: Task = {
                title: 'test title value',
                description: 'test description value',
                status: Status.COMPLETE,
                dueAt: date
            } as Task;
            if(id) {
                task.id = id;
            }
            return task;
        }
    });

});
