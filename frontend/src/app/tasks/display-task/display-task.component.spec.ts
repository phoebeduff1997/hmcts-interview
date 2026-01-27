import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DisplayTaskComponent} from './display-task.component';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../services/task.service';
import {Status} from '../models/enums/status.model';
import {Task} from '../models/task.model';
import {of} from 'rxjs';

describe('DisplayTaskComponent', () => {
    let component: DisplayTaskComponent;
    let fixture: ComponentFixture<DisplayTaskComponent>;
    let mockTaskService: jasmine.SpyObj<TaskService>;

    beforeEach(async () => {
        mockTaskService = jasmine.createSpyObj<TaskService>('TaskService', ['getTask']);
        mockTaskService.getTask.and.returnValue(of(createTask()));

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                DisplayTaskComponent
            ],
            providers: [
                { provide: TaskService, useValue: mockTaskService },
                { provide: ActivatedRoute, useValue: {snapshot: {params: {'id': 123}}}}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should get the correct task', () => {
            component.ngOnInit();

            expect(mockTaskService.getTask).toHaveBeenCalledWith(123);
            expect(component.task().id).toEqual(123);
        });
    });

    function createTask(): Task {
        return {
            id: 123,
            title: 'test title',
            description: 'test description',
            status: Status.NOT_STARTED,
            dueAt: new Date()
        } as Task;
    }
});
