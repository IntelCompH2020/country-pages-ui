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
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {
  ContributionsHomeExtensionComponent
} from "./pages/contribution-dashboard-extension/home/contributions-home-extension.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'contributions/:id/',
    pathMatch: 'full',
    redirectTo: 'contributions/:id/home'
  },
  {
    path: 'contributions/:id/home',
    component: ContributionsHomeExtensionComponent,
  },
  {
    path: '',
    loadChildren: () => import('../survey-tool/app/survey-tool.module').then(m => m.SurveyToolModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
