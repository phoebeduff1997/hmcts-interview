import {Status} from './enums/status.model';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: Status;
    dueAt: Date;
}
