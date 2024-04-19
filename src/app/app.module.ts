/*
 * Copyright 2021-2024 OpenAIRE AMKE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';
import {NgxMatomoRouterModule} from '@ngx-matomo/router';
import {SurveyToolModule} from "../survey-tool/app/survey-tool.module";
import {UserService} from "../survey-tool/app/services/user.service";
import {SharedModule} from "./shared/shared.module";
import {HttpInterceptorService} from "./pages/services/http-interceptor.service";
import {
  ContributionsHomeExtensionComponent
} from "./pages/contribution-dashboard-extension/home/contributions-home-extension.component";

@NgModule({
  declarations: [
    AppComponent,
    ContributionsHomeExtensionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SurveyToolModule,
    NgxMatomoTrackerModule.forRoot({trackerUrl: '', siteId: ''}),
    NgxMatomoRouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
