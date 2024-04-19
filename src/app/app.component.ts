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

import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../survey-tool/app/services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'country-pages-ui';

  constructor(private router: Router, private auth: AuthenticationService) {
    this.auth.redirect();
  }

  isContributionsDashboardRoute() {
    return (this.router.url.startsWith('/contributions'));
  }

  isEOSCReadinessDashboardRoute() {
    return (this.router.url.startsWith('/eoscreadiness'));
  }

}
