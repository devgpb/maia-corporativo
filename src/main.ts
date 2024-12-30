import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
