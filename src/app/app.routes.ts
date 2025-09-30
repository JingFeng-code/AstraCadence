import { Routes } from '@angular/router';
import { Tasks } from './tasks/tasks';
import { Login } from "./login/login";
import { AuthGuard } from './auth.guard';  // 載入 AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'tasks', component: Tasks, canActivate: [AuthGuard] },  // 使用 AuthGuard
];