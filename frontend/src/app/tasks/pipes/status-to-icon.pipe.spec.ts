import {StatusToIconPipe} from './status-to-icon.pipe';
import {Status} from '../models/enums/status.model';

describe('StatusToIconPipe', () => {
    const pipe = new StatusToIconPipe();

    it('should return correct result when status not_started', () => {
        expect(pipe.transform(Status.NOT_STARTED)).toEqual('pending');
    });

    it('should return correct result when status in_progress', () => {
        expect(pipe.transform(Status.IN_PROGRESS)).toEqual('clock_loader_40');
    });

    it('should return correct result when status complete', () => {
        expect(pipe.transform(Status.COMPLETE)).toEqual('check_circle');
    });

    it('should return correct result when status overdue', () => {
        expect(pipe.transform(Status.OVERDUE)).toEqual('error');
    });
});
