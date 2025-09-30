import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// 將 swiper 元件註冊為 custom elements
import 'swiper/element/bundle';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)]
});