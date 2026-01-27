import {Status} from '../models/enums/status.model';
import {DisplayStringEnumValuesPipe} from './display-string-enum-values.pipe';
import {TitleCasePipe} from '@angular/common';

describe('DisplayStringEnumValuesPipe', () => {
    const pipe = new DisplayStringEnumValuesPipe(new TitleCasePipe());

    it('should return correct result when status not_started', () => {
        expect(pipe.transform(Status.NOT_STARTED)).toEqual('Not Started');
    });

    it('should return correct result when status in_progress', () => {
        expect(pipe.transform(Status.IN_PROGRESS)).toEqual('In Progress');
    });

    it('should return correct result when status complete', () => {
        expect(pipe.transform(Status.COMPLETE)).toEqual('Complete');
    });

    it('should return correct result when status overdue', () => {
        expect(pipe.transform(Status.OVERDUE)).toEqual('Overdue');
    });

    it('should remove all underscores and capitalise each word', () => {
        expect(pipe.transform('example_TEST_to_CHECK')).toEqual('Example Test To Check');
    });
});
