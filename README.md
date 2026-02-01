# HMCTS Task Tracker Application

## Overview
This repository contains a full-stack task tracking application developed as part of the HMCTS Developer Challenge.  
It provides a backend API and a frontend UI that allow users to create, view, update, and delete tasks while tracking their statuses and due dates.

The application also includes automated status updates for overdue tasks, validation, and error handling.

---

## Features
- **Task Management:** Create, edit, delete, and view tasks.
- **Status Management:** Update task status with validation; automatically mark overdue tasks.
- **Frontend:** Angular-based UI with task list and display components.
- **Backend:** Spring Boot REST API for task CRUD operations.
- **Validation:** Ensures only valid status updates, as well as required fields.
- **Error Handling:** Global exception handling for API errors.
- **Testing:** Unit tests for backend services, controllers, and frontend components.

---

## Tech Stack
- **Backend:** Java 21, Spring Boot, Maven
- **Frontend:** Angular 21, TypeScript, SCSS, HTML
- **Database:** H2 in-memory database (pre-populated on startup with sample data)
- **Testing:** JUnit, Mockito (backend); Jasmine/Karma (frontend)

---

## Installation

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 24+
- Angular CLI

### Backend Setup
Start the backend by doing the following:

    cd backend
    mvn clean install
    mvn spring-boot:run

The API will be available at http://localhost:8080/api/task.

### Frontend Setup
Start the frontend by doing the following:

    cd frontend
    npm ci
    ng serve

Open http://localhost:4200 in your browser.

---

## API Documentation

### API Endpoints 

Create task

    POST /api/task
    Content type: application/json
    {
        "title": "Task title",
        "description": "Task description",
        "status": "NOT_STARTED",
        "dueAt": "2026-01-31T23:38:28.571Z",
    }

Get all tasks
    
    GET /api/task
    Content type: application/json

Get task by id

    GET /api/task/{id}
    Content type: application/json

Update task status

    PATCH /api/task/status
    Content type: application/json
    {
        "id": 1,
        "status": "IN_PROGRESS"
    }

Delete task

    DELETE /api/task/{id}

Recently overdue tasks

    GET /api/task/overdue
    Content type: text/event-stream

### Task status values

- `NOT_STARTED`
- `IN_PROGRESS`
- `COMPLETE`
- `OVERDUE`
  - A task cannot be created or updated with a status value of `OVERDUE`, deciding whether a task is overdue is handled by the backend

## Unit tests

Run all backend tests
    
    mvn test

Run all backend tests with code coverage, will be generated at `backend/target/site/jacoco/index.html`

    mvn clean test jacoco:report

Run all frontend tests

    ng test

Run all frontend tests with code coverage, will be generated at `frontend/coverage/frontend/index.html`

    ng test --coverage 

<p align="center">
  <img alt="Backend coverage report" src="/documentation-resources/backend-report.PNG" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Frontend coverage report" src="/documentation-resources/frontend-report.PNG" width="45%">
</p>