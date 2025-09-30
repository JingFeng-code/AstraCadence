export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  created_at?: string;
}
