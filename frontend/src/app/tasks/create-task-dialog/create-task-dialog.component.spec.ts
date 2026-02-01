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

            expect(formControlIdentifiers.length).toEqual(5);
            expect(formControlIdentifiers.indexOf('title') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('description') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('status') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('dueAtDate') > -1).toBeTrue();
            expect(formControlIdentifiers.indexOf('dueAtTime') > -1).toBeTrue();
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

            component.newTaskForm.controls['status'].setValue(null);
            expect(component.newTaskForm.controls['status'].valid).toBeFalse();
        });

        it('should have correct validation for dueAtTime', () => {
            expect(component.newTaskForm.controls['dueAtTime'].value).toBeInstanceOf(Date);
            expect(component.newTaskForm.controls['dueAtTime'].valid).toBeTrue();

            component.newTaskForm.controls['dueAtTime'].setValue(new Date());
            expect(component.newTaskForm.controls['dueAtTime'].valid).toBeTrue();

            component.newTaskForm.controls['dueAtTime'].setValue(null);
            expect(component.newTaskForm.controls['dueAtTime'].valid).toBeFalse();
        });

        it('should have invalid form if field invalid', () => {
            expect(component.newTaskForm.valid).toBeFalse();
        });

        it('should have valid form if all fields valid', () => {
            component.newTaskForm.controls['title'].setValue('test title value');
            expect(component.newTaskForm.valid).toBeTrue();
        });

        describe('ValidateTitle', () => {
            it('should validate title as true when valid', () => {
                expect(component.newTaskForm.controls['title'].valid).toBeFalse();
                component.newTaskForm.controls['title'].setValue('test title value');
                expect(component.newTaskForm.controls['title'].valid).toBeTrue();
            });

            it('should validate title as true when title has leading/trailing spaces', () => {
                expect(component.newTaskForm.controls['title'].valid).toBeFalse();
                component.newTaskForm.controls['title'].setValue('   title   ');
                expect(component.newTaskForm.controls['title'].valid).toBeTrue();
            });

            it('should validate title as false when title is only empty string', () => {
                expect(component.newTaskForm.controls['title'].valid).toBeFalse();
                component.newTaskForm.controls['title'].setValue('      ');
                expect(component.newTaskForm.controls['title'].valid).toBeFalse();
            });
        });

        describe('validateDate', () => {
            it('should validate dueAtDate as true when valid', () => {
                expect(component.newTaskForm.controls['dueAtDate'].value).toBeInstanceOf(Date);
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeTrue();

                component.newTaskForm.controls['dueAtDate'].setValue(new Date());
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeTrue();
            });

            it('should validate dueAtDate as false when null', () => {
                component.newTaskForm.controls['dueAtDate'].setValue(null);
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeFalse();
            });

            it('should validate dueAtDate as false when not a date', () => {
                component.newTaskForm.controls['dueAtDate'].setValue("not a date");
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeFalse();
            });

            it('should validate dueAtDate as false when date form not valid', () => {
                component.newTaskForm.controls['dueAtDate'].setValue(new Date('123456789'));
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeFalse();
            });

            it('should validate dueAtDate as false when year less than 1900', () => {
                let date: Date = new Date();
                date.setFullYear(1899);
                component.newTaskForm.controls['dueAtDate'].setValue(date);
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeFalse();
            });

            it('should validate dueAtDate as false when year more than 3000', () => {
                let date: Date = new Date();
                date.setFullYear(3001);
                component.newTaskForm.controls['dueAtDate'].setValue(date);
                expect(component.newTaskForm.controls['dueAtDate'].valid).toBeFalse();
            });
        });
    });

    describe('saveTask', () => {
        it('should save and close with the correct value', () => {
            const currentDateTime = new Date();
            setUpValidForm(currentDateTime);
            const sentTask: Task = createTestTask(currentDateTime);
            const recievedTask: Task = createTestTask(currentDateTime, 1);
            mockTaskService.createTask.and.returnValue(of(recievedTask));

            component.saveTask();

            expect(mockTaskService.createTask).toHaveBeenCalledWith(jasmine.objectContaining({
                title: sentTask.title,
                description: sentTask.description,
                status: sentTask.status
            }));
            expect(sentTask.dueAt.toISOString()).toEqual(recievedTask.dueAt.toISOString());
            expect(mockDialog.close).toHaveBeenCalledWith(recievedTask);

        });

        it('should remove whitespace from title when saving', () => {
            component.newTaskForm.controls['title'].setValue('     title      ');
            const recievedTask: Task = {title: 'title'} as Task;;
            mockTaskService.createTask.and.returnValue(of(recievedTask));

            component.saveTask();

            expect(mockTaskService.createTask).toHaveBeenCalledWith(jasmine.objectContaining({
                title: 'title'
            }));
            expect(mockDialog.close).toHaveBeenCalledWith(recievedTask);
        });

        function setUpValidForm(date: Date): void {
            component.newTaskForm.controls['title'].setValue('test title value');
            component.newTaskForm.controls['description'].setValue('test description value');
            component.newTaskForm.controls['status'].setValue(Status.COMPLETE);
            component.newTaskForm.controls['dueAtDate'].setValue(date);
            component.newTaskForm.controls['dueAtTime'].setValue(date);
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
