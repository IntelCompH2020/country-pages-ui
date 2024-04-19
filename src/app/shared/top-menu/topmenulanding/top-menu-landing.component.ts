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

import {Component, OnDestroy, OnInit} from "@angular/core";
import {Coordinator, Stakeholder, UserInfo} from "../../../../survey-tool/app/domain/userInfo";
import {UserService} from "../../../../survey-tool/app/services/user.service";
import {AuthenticationService} from "../../../../survey-tool/app/services/authentication.service";
import {Router} from "@angular/router";
import {Subscriber} from "rxjs";

@Component({
  selector: 'app-top-menu-landing',
  templateUrl: 'top-menu-landing.component.html',
  styleUrls: ['../top-menu.component.css'],
})

export class TopMenuLandingComponent implements OnInit, OnDestroy {

  subscriptions = [];
  showLogin = true;
  showNationalContributionsToEOSC: boolean = null;
  showArchive: boolean = null;
  ready = false;
  userInfo: UserInfo = null;

  constructor(private userService: UserService, private authentication: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    if (this.authentication.authenticated) {
      this.subscriptions.push(
        this.userService.getUserInfo().subscribe(
          next => {
            this.userService.setUserInfo(next);
            this.userInfo = next;
            this.showLogin = false
            this.ready = true;
            this.showNationalContributionsToEOSC = this.coordinatorOrManager('country');
            this.showArchive = this.coordinatorContains('country');
          },
          error => {
            console.log(error);
            this.ready = true;
          }
        )
      );
    } else {
      this.ready = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription instanceof Subscriber) {
        subscription.unsubscribe();
      }
    });
  }

  setGroup(group: Stakeholder) {
    this.userService.changeCurrentStakeholder(group);
    this.router.navigate([`/contributions/${group.id}/home`]);
  }

  setCoordinator(coordinator: Coordinator){
    this.userService.changeCurrentCoordinator(coordinator);
    this.router.navigate([`/contributions/${coordinator.id}/home`]);
  }

  coordinatorOrManager(name: string) {
    if (this.userInfo.coordinators.filter(c => c.type === name).length > 0) {
      return true;
    } else if (this.userInfo.stakeholders.filter(c => c.type === name).length > 0) {
      let stakeHolders: Stakeholder[] = this.userInfo.stakeholders.filter(c => c.type === name);
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      for (const stakeHolder of stakeHolders) {
        // console.log(stakeHolder.name);
        if (stakeHolder.admins.indexOf(userInfo.user.email) >= 0)
          return true;
      }
      return false
    } else {
      return false
    }

  }

  coordinatorContains(name: string): boolean {
    return this.userInfo.coordinators.filter(c => c.type === name).length > 0;
  }

  logInButton() {
    this.authentication.login();
  }

  logout() {
    this.authentication.logout();
  }
}
