import { TaskRepository } from '@/data/repositories/TaskRepository';
import { TaskEntity } from '@/domain/entities/TaskEntity';

export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<TaskEntity[]> {
    const tasks = await this.taskRepository.getTasks();
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      category: task.category,
    }));
  }
}
