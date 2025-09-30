import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  // 載入圖片
  users = [
    { name: '宋佳翰', avatarUrl: 'assets/images/1.jpg' },
    { name: '楊鎮庭', avatarUrl: 'assets/images/2.jpg' },
    { name: '朱仲文', avatarUrl: 'assets/images/3.jpg' },
    { name: '謝維澤', avatarUrl: 'assets/images/4.jpg' },
    { name: '蔡旌峰', avatarUrl: 'assets/images/5.jpg' },
    { name: '林佳慧', avatarUrl: 'assets/images/6.jpg' },
    { name: '陳致融', avatarUrl: 'assets/images/7.jpg' },
  ];

  currentIndex = 0;
  selectedImageIndex: number | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.users.length) % this.users.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.users.length;
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  login() {
    if (this.selectedImageIndex !== null) {
      const user = this.users[this.selectedImageIndex];
      this.authService.login(user);
      this.router.navigate(['/tasks']);
    }
  }

  getSlideStyle(index: number) {
    const total = this.users.length;
    let pos = index - this.currentIndex;

    // 處理循環索引
    if (pos < -Math.floor(total / 2)) pos += total;
    if (pos > Math.floor(total / 2)) pos -= total;

    const vw = window.innerWidth;
    const baseOffset = vw * 0.06;

    let scale = 0.5;
    let blur = 8;
    let opacity = 0;
    let zIndex = 0;
    let offset = 0;

    if (pos === 0) {
      scale = 1;
      blur = 0;
      opacity = 1;
      zIndex = 3;
    } else if (Math.abs(pos) === 1) {
      offset = pos * baseOffset * 5;
      scale = 0.8;
      blur = 2;
      opacity = 0.7;
      zIndex = 2;
    } else if (Math.abs(pos) === 2) {
      offset = pos * baseOffset * 10;
      scale = 0.6;
      blur = 5;
      opacity = 0.4;
      zIndex = 1;
    }

    return {
      left: '50%',
      transform: `translateX(calc(-50% + ${offset}px)) scale(${scale})`,
      filter: `blur(${blur}px)`,
      opacity: opacity.toString(),
      zIndex: zIndex.toString(),
    };
  }

  isSelected(index: number) {
    return this.selectedImageIndex === index;
  }
}
