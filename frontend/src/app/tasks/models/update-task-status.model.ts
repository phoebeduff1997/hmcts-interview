import {Status} from './enums/status.model';

export interface UpdateTaskStatus {
    id: number;
    status: Status;
}
