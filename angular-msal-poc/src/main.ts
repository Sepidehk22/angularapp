import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppConfigService } from './app/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// Create an instance of the AppConfigService
const appConfigService = new AppConfigService(new HttpClient({} as HttpHandler));

// Load the configuration before bootstrapping the application
firstValueFrom(appConfigService.loadConfig()).then((config) => {
  platformBrowserDynamic([
    { provide: 'APP_CONFIG', useValue: config }
  ])
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
});
