# NodeJS-Course3
Repository for NodeJS Discipline


# Goal
Create useful API to manage processes in fandub projects and tasks. Add, Remove and Update projects; Remind about deadlines and when task of one department is done and can be passed to another department.

# Technologies
- NodeJS
- NestJS
- TypeScript
- PrismaORM
- PostgreSQL

# Components Diagram
![Component Diagram](./docs/ComponentsDiagram.png)

# Data Diagram
![Data Diagram](./docs/DataDiagram.png)

# Scenarios
### 1. Creating a project
- User makes `/POST` request with _title name_ and _number of episodes_ in body. 
- A new **Project** record is added.
- The system automatically creates **Task** records for each episode and each process stage.
- Each task gets:
    - `type = translation|editing|casting|recording|correctionWriting|correctionRecording|mixing`
    - `status = todo`
    - `projectId` referencing the created project.

**Data updates:** new Project + multiple Tasks.

---

### 2. Changing the stage of a task
- User makes `/PATCH` request to update task status with _status name_ in body.
- The system updates the task `status` (`todo → in_progress → done`).
- If the stage is completed, the system may:
    - Notify, that the next stage can be started.

**Data updates:** task field `status` are modified.

---

### 3. Assigning work to users
- User makes `/PATCH` request to assign a task with _userName_ in body.
- The system updates the `assignedTo` field.
- The `status` may change to `in_progress`.

**Data updates:** task field `assignedTo` are modified.

---

### 4. Deadlines and reminders
- A scheduler checks deadlines once a day:
- If `deadline < now` and `status != done`, the task becomes overdue.
- The system may notify about delay.

---

### 5. Data aggregation
- User makes `/GET` request for `\project\:id\progress` to get project progress.
  - **Project progress:** `completedTasks / totalTasks`
- User makes `/GET` request for `\project\:id\episodes\:number\progress` to get progress for a specific episode.
  - **Episode progress:** `completedTasksForEpisode / totalTasksForEpisode`


#### _Author: Kaliberda Anton Dmytrovych, student of FICT IM-32_

