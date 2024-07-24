export interface TaskEntity {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'not_started';
    category: 'Hogar' | 'Escuela' | 'Deportes' | 'Salud';
  }
  