import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_CONFIG, BaseAppConfig } from "./app.config";
import { AppService } from './utils/services/app.service';
import { DialogService } from './utils/services/dialog_util/dialog.service';
import { RouteDataService } from './utils/services/route-data.service';
import { EventBroadcasterService } from './utils/services/event-broadcaster.service';
import { MaterialModule } from './material.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './utils/services/dialog_util/alert.component';
import { InfoComponent } from './utils/services/dialog_util/info.component';
import { ErrorComponent } from './utils/services/dialog_util/error.component';
import { ConfirmComponent } from './utils/services/dialog_util/confirm.component';
import { ProgressComponent } from './utils/services/dialog_util/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    InfoComponent,
    ErrorComponent,
    ConfirmComponent,
    ProgressComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DialogModule,
    ChartsModule,
    ReactiveFormsModule, 
    BrowserAnimationsModule,    
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true 
    }),
    HttpClientModule,
    MaterialModule 
  ],
  providers: [ DialogService, AppService, RouteDataService, EventBroadcasterService, {provide: APP_CONFIG, useValue: BaseAppConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
