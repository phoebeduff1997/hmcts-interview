import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../models/task.model';
import {HmctsModelApi} from '../../hmcts-model.api';
import {UpdateTaskStatus} from '../models/update-task-status.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(private http: HttpClient) {
    }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(HmctsModelApi.Task.get.getAllTasks);
    }

    getTask(id: number): Observable<Task> {
        return this.http.get<Task>(`${HmctsModelApi.Task.get.getTask}/${id}`);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(HmctsModelApi.Task.post.createTask, task);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${HmctsModelApi.Task.delete.deleteTask}/${id}`);
    }

    updateTaskStatus(updateTaskStatus: UpdateTaskStatus): Observable<Task> {
        return this.http.patch<Task>(HmctsModelApi.Task.patch.updateTaskStatus, updateTaskStatus);
    }

    streamRecentlyOverdueTasks(): Observable<Task[]> {
        return new Observable<Task[]>(subscriber => {
            const eventSource = new EventSource(HmctsModelApi.Task.get.getAllRecentlyOverdueTasks);

            eventSource.onmessage = event => {
                const tasks: Task[] = JSON.parse(event.data);
                subscriber.next(tasks);
            };

            eventSource.onerror = error => {
                //TODO better error handing
                console.log('SSE error', error);
                eventSource.close();
                subscriber.complete();
            };

            return () => eventSource.close();
        });
    }
}
