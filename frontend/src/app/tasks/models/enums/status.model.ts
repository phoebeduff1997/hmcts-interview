export enum Status {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
    OVERDUE = 'OVERDUE'
}

export function statusArrayOptionalOverdue(status: Status): Array<string> {
    if(status === Status.OVERDUE) {
        return [Status.OVERDUE.valueOf(), Status.COMPLETE.valueOf()];
    } else {
        return statusArray();
    }
}

export function statusArray(): Array<string>{
    const allStatuses = Object.keys(Status);
    const filtered = allStatuses.filter(status => status !== Status.OVERDUE);
    return filtered;
}
