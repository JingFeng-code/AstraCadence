import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Task {
  id: string;
  title: string;
  status: string;
  is_done: boolean;
  created_at?: string;
  start_date?: string;
  due_date?: string;
  note?: string;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private supabaseService: SupabaseService) {}

  async getTasks(): Promise<Task[]> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Task[]; // 確保類型一致
  }

  async addTask(task: Omit<Task, 'id' | 'created_at'>): Promise<void> {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('tasks').insert([task]);

    if (error) throw new Error(error.message);
  }

  async updateTaskStatus(id: string, status: string): Promise<void> {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('tasks').update({ status }).eq('id', id);

    if (error) throw new Error(error.message);
  }

  async deleteTask(id: string): Promise<void> {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('tasks').delete().eq('id', id);

    if (error) throw new Error(error.message);
  }
}
