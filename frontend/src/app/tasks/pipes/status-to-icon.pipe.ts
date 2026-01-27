import {Pipe, PipeTransform} from '@angular/core';
import {Status} from '../models/enums/status.model';

@Pipe({
    name: 'statusToIcon'
})
export class StatusToIconPipe implements PipeTransform {
    constructor() {}

    transform(status: Status): string {
        switch (status) {
            case Status.NOT_STARTED: return 'pending';
            case Status.IN_PROGRESS: return 'clock_loader_40';
            case Status.COMPLETE: return 'check_circle';
            case Status.OVERDUE: return 'error';
        }
    }
}
