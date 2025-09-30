import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';
import { GanttView } from '../gantt-view/gantt-view';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GanttView, CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tasks: Task[] = [];

  // 表單欄位
  newTaskTitle = '';
  newTaskStartDate = '';
  newTaskDueDate = '';
  newTaskNote = '';

  // UI 狀態控制
  showAddTaskModal = false; // 控制新增任務 Modal
  showGantt = false; // 控制甘特圖 Modal
  showTaskForm = false; // 控制新增任務 Modal

  currentUser: any = null;

  statuses = ['todo', 'doing', 'done'];
  statusLabels: Record<string, string> = {
    todo: '待辦',
    doing: '進行中',
    done: '已完成',
  };

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    await this.loadTasks();
  }

  async loadTasks() {
    try {
      this.tasks = await this.taskService.getTasks();
    } catch (error) {
      console.error('取得任務失敗', error);
    }
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) return;
    try {
      await this.taskService.addTask({
        title: this.newTaskTitle.trim(),
        status: 'todo',
        is_done: false,
        start_date: this.newTaskStartDate
          ? new Date(this.newTaskStartDate).toISOString()
          : undefined,
        due_date: this.newTaskDueDate
          ? new Date(this.newTaskDueDate).toISOString()
          : undefined,
        note: this.newTaskNote?.trim() || '',
        createdBy: this.currentUser?.name || '訪客',
      });

      this.newTaskTitle = '';
      this.newTaskStartDate = '';
      this.newTaskDueDate = '';
      this.newTaskNote = '';

      this.showAddTaskModal = false; // 新增完關閉彈窗
      await this.loadTasks();
    } catch (error) {
      console.error('新增任務失敗', error);
    }
  }

  async changeTaskStatus(task: Task, status: string) {
    if (task.status === status) return;
    try {
      await this.taskService.updateTaskStatus(task.id, status);
      await this.loadTasks();
    } catch (error) {
      console.error('變更任務狀態失敗', error);
    }
  }

  async deleteTask(task: Task) {
    try {
      await this.taskService.deleteTask(task.id);
      await this.loadTasks();
    } catch (error) {
      console.error('刪除任務失敗', error);
    }
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  calculateDaysLeft(dueDateStr: string | undefined): string {
    if (!dueDateStr) return '';

    const dueDate = new Date(dueDateStr);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return '已截止';
    } else {
      return `剩下 ${diffDays} 天`;
    }
  }

  toggleTaskForm() {
    this.showTaskForm = !this.showTaskForm;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
