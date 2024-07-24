import { TaskModel } from '../models/TaskModel';

export interface TaskRepository {
  getTasks(): Promise<TaskModel[]>;
}
