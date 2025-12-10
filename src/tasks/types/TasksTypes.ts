export type TaskType =
  | 'translation'
  | 'editing'
  | 'casting'
  | 'recording'
  | 'correctionWriting'
  | 'correctionRecording'
  | 'mixing';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  episodeNumber: number;
  type: TaskType;
  status: TaskStatus;
  assignedTo: string | null;
  deadline: Date | null;
}
