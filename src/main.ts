import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Імпорт конфігурації
import { AppComponent } from './app/app.component'; // Імпорт основного компонента

bootstrapApplication(AppComponent, appConfig) // Завантаження додатку
  .catch((err) => console.error(err));
