import { TaskModel } from '../models/TaskModel';
import { TaskRepository } from './TaskRepository';
import { apiClient } from '../datasources/ApiClient';

export class TaskRepositoryApi implements TaskRepository {
  async getTasks(): Promise<TaskModel[]> {
    return await apiClient.get('/tasks');
  }

  async createTask(task: TaskModel): Promise<void> {
    await apiClient.post('/tasks', task);
  }
}
