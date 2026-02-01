# Design Decisions and Trade-offs

## Backend 

### Database
For ease of local set up I have opted to use a local in memory database. This would usually be better 
served for integration tests, but to simulate a "live" environment the database is prepopulated with 
data on load

### Overdue scheduler

I set up an async task executor to handle the SSE stream for recently overdue tasks. For this demo, 
I kept the thread pool and scheduling simple. In a production scenario, I would replace Spring MVC 
with WebFlux to handle non-blocking requests and scale to more concurrent users.

### Logging 

The spec document didnt ask for logging, so I have only explicity logged the backend. If this was 
local/small scale production code (e.g. a desktop app or a small internal tool) I would configure 
the frontend error handler to send the logs to the backend and log for agregated error logging. 
If this was a live instance with many users, I would also consider other tools like 
Sentry/Datadog/Elastic depending on requirements

### Pagination

I did not implement pagination since the task volume is expected to be small for this demo. In 
production, GET requests would be paged and the frontend would implement pagination or virtual 
scrolling to improve performance and reduce payload size.

### Validation and error handling

All critical validation, such as task field validation and overdue determination, is enforced by
the backend. The frontend only provides immediate feedback for user convenience. This keeps the 
backend as the source of truth and prevents invalid state transitions.

## Frontend 

### State management 

I used Angular signals and services for state management. I chose not to introduce a global state 
solution since the data flow is simple. If the app were larger or required multi-view 
synchronization, a shared state solution could be introduced.

### Performance considerations

No advanced frontend performance optimizations were implemented since the expected data volume is 
low. In a production scenario, I would consider OnPush change detection, virtual scrolling, or 
caching strategies to improve performance.