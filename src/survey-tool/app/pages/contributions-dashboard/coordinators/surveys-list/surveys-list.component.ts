import {Component, OnInit} from "@angular/core";
import {Paging} from "../../../../../catalogue-ui/domain/paging";
import {Model} from "../../../../../catalogue-ui/domain/dynamic-form-model";
import {UserService} from "../../../../services/user.service";
import {SurveyService} from "../../../../services/survey.service";
import {Subscriber} from "rxjs";
import {Coordinator} from "../../../../domain/userInfo";
import { StakeholdersService } from "../../../../services/stakeholders.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-survey-lists',
  templateUrl: 'surveys-list.component.html',
  providers: [SurveyService, StakeholdersService]
})

export class SurveysListComponent implements OnInit{

  subscriptions = [];
  coordinator: Coordinator = null;
  surveys: Paging<Model> = null;

  constructor(private surveyService: SurveyService, private stakeholderService: StakeholdersService,
              private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.coordinator = JSON.parse(sessionStorage.getItem('currentCoordinator'));
    if (!this.coordinator) {
      this.getCoordinator();
    } else {
      this.getSurveys();
    }
  }

  getCoordinator() {
    this.route.snapshot.paramMap.get('id')
    this.stakeholderService.getCoordinatorById(this.route.snapshot.paramMap.get('id')).subscribe({
      next: value => this.coordinator = value,
      error: err => console.error(err),
      complete: () => this.getSurveys()
    });
  }

  getSurveys() {
    console.log(this.coordinator);
    this.userService.changeCurrentCoordinator(this.coordinator);
    if (this.coordinator?.type) {
      this.subscriptions.push(
        this.surveyService.getSurveys('type', this.coordinator.type).subscribe(
          next => { this.surveys = next; },
          error => {console.error(error);}
        )
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription instanceof Subscriber) {
        subscription.unsubscribe();
      }
    });
  }

}
