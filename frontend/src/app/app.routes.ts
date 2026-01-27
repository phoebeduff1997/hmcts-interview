import {Routes} from '@angular/router';
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {DisplayTaskComponent} from './tasks/display-task/display-task.component';

export const routes: Routes = [
    { path: 'tasks', component: TaskListComponent },
    { path: 'tasks/:id', component: DisplayTaskComponent },
    { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];
