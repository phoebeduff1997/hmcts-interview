const BASE_BACKEND_LOCATION = 'http://localhost:8080/';
const TASK_BASE = BASE_BACKEND_LOCATION + 'api/task';

export const HmctsModelApi = {
    Task: {
        get: {
            getAllTasks: TASK_BASE,
            getAllRecentlyOverdueTasks: TASK_BASE + '/overdue',
            getTask: TASK_BASE
        },
        post: {
            createTask: TASK_BASE
        },
        patch: {
            updateTaskStatus: TASK_BASE + '/status'
        },
        delete: {
            deleteTask: TASK_BASE
        }
    }
}
