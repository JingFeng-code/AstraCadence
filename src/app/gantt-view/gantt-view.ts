import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { Task } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare let gantt: any;

@Component({
  standalone: true,
  selector: 'app-gantt-view',
  templateUrl: './gantt-view.html',
  styleUrls: ['./gantt-view.css'],
  imports: [CommonModule, FormsModule]
})

export class GanttView implements OnInit, OnDestroy, OnChanges {
  @Input() tasks: Task[] = [];

  ganttHeight = '600px'; // 初始高度

  // 新增：createdBy 下拉選單用清單與選擇值
  createdByList: string[] = [];
  selectedCreatedBy = '';

  ngOnInit() {
    this.setGanttHeight();

    gantt.locale = {
      date: {
        month_full: [
          '一月', '二月', '三月', '四月', '五月', '六月',
          '七月', '八月', '九月', '十月', '十一月', '十二月',
        ],
        month_short: [
          '1月', '2月', '3月', '4月', '5月', '6月',
          '7月', '8月', '9月', '10月', '11月', '12月',
        ],
        day_full: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        day_short: ['日','一','二','三','四','五','六'],
      },
    };

    gantt.config.columns = [
      { name: 'text', label: '任務', tree: true },
      { name: 'start_date', label: '開始時間', align: 'center' },
      { name: 'duration', label: '天數', align: 'center' },
    ];

    gantt.config.date_format = '%Y-%m-%d';

    gantt.config.scale_unit = 'day';
    gantt.config.date_scale = '%m月%j號';

    gantt.templates.task_text = (
      start: Date,
      end: Date,
      task: { text: string }
    ) => {
      return `<span style="font-weight:bold; font-size:14px; color:#333;">${task.text}</span>`;
    };

    gantt.templates.task_class = (
      start: Date,
      end: Date,
      task: { progress: number }
    ) => {
      if (task.progress === 1) return 'task-done';
      if (task.progress > 0) return 'task-doing';
      return 'task-todo';
    };

    gantt.templates.progress_text = (start: Date, end: Date, task: any) => {
      return '';
    };

    gantt.attachEvent("onTaskLoading", (task: any) => {
      if (task.progress === 1) {
        task.color = '#4caf50';
        task.progressColor = '#2e7d32';
      } else if (task.progress > 0) {
        task.color = '#ffc107';
        task.progressColor = '#ff8f00';
      } else {
        task.color = '#79e3eb';
        task.progressColor = '#2230f3';
      }
      return true;
    });

    gantt.attachEvent("onGanttRender", () => {
      setTimeout(() => {
        this.applyCustomStyles();
      }, 100);
    });

    gantt.init('gantt_here');

    this.buildCreatedByList();

    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.buildCreatedByList(); // 資料改變時更新 createdBy 清單
      this.loadTasks();
    }
  }

  ngOnDestroy() {
    gantt.clearAll();
  }

  @HostListener('window:resize')
  onResize() {
    this.setGanttHeight();
  }

  setGanttHeight() {
    const vh = window.innerHeight;
    this.ganttHeight = Math.floor(window.innerHeight * 0.60) + 'px'; // 85%
    const ganttContainer = document.getElementById('gantt_here');
    if (ganttContainer) {
      ganttContainer.style.height = this.ganttHeight;
      gantt.render();
    }
  }

  // 建立篩選用的 createdBy 清單 (去重)
  buildCreatedByList() {
    const creators = this.tasks
      .map((t) => t.createdBy)
      .filter((c) => c !== undefined && c !== null);
    this.createdByList = Array.from(new Set(creators));
  }

  // 下拉選單改變事件
  onCreatedByChange() {
    this.loadTasks();
  }

  loadTasks() {
    // 篩選任務
    let filteredTasks = this.tasks;
    if (this.selectedCreatedBy) {
      filteredTasks = this.tasks.filter((t) => t.createdBy === this.selectedCreatedBy);
    }

    const tasksForGantt = {
      data: filteredTasks.map((t) => {
        const startDate = this.getStartDate(t);
        const duration = this.getDuration(t, startDate);
        const progress = t.status === 'done' ? 1 : t.status === 'doing' ? 0.5 : 0;

        return {
          id: t.id,
          text: t.title,
          start_date: this.formatDate(startDate),
          duration: duration,
          progress: progress,
          open: true,
          color: progress === 1 ? '#4caf50' : progress > 0 ? '#ffc107' : '#79e3eb',
          progressColor: progress === 1 ? '#2e7d32' : progress > 0 ? '#ff8f00' : '#2230f3',
        };
      }),
      links: [],
    };

    gantt.clearAll();
    gantt.parse(tasksForGantt);

    setTimeout(() => {
      this.applyCustomStyles();
    }, 200);
  }

  private applyCustomStyles() {
    const taskBars = document.querySelectorAll('.gantt_task_line');
    const progressBars = document.querySelectorAll('.gantt_task_progress');

    taskBars.forEach((taskBar: any) => {
      const taskId = taskBar.getAttribute('data-task-id') || taskBar.getAttribute('task_id');
      if (taskId) {
        const task = gantt.getTask(taskId);
        if (task) {
          if (task.progress === 1) {
            taskBar.style.backgroundColor = '#4caf50';
            taskBar.style.borderRadius = '10px';
          } else if (task.progress > 0) {
            taskBar.style.backgroundColor = '#ffc107';
            taskBar.style.borderRadius = '10px';
          } else {
            taskBar.style.backgroundColor = '#79e3eb';
            taskBar.style.borderRadius = '10px';
          }
        }
      }
    });

    progressBars.forEach((progressBar: any) => {
      const taskId = progressBar.getAttribute('data-task-id') || progressBar.getAttribute('task_id');
      if (taskId) {
        const task = gantt.getTask(taskId);
        if (task) {
          if (task.progress === 1) {
            progressBar.style.fill = '#2e7d32';
            progressBar.setAttribute('rx', '10');
            progressBar.setAttribute('ry', '10');
          } else if (task.progress > 0) {
            progressBar.style.fill = '#ff8f00';
            progressBar.setAttribute('rx', '10');
            progressBar.setAttribute('ry', '10');
          } else {
            progressBar.style.fill = '#2230f3';
            progressBar.setAttribute('rx', '10');
            progressBar.setAttribute('ry', '10');
          }
        }
      }
    });
  }

  private getStartDate(task: Task): Date {
    return task.created_at ? new Date(task.created_at) : new Date();
  }

  private getDuration(task: Task, startDate: Date): number {
    if (!task.due_date) return 1;

    const endDate = new Date(task.due_date);
    const diff = endDate.getTime() - startDate.getTime();
    const duration = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return duration > 0 ? duration : 1;
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }
}
