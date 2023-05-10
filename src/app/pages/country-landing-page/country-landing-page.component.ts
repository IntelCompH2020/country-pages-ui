import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../survey-tool/app/services/survey.service";
import {SurveyAnswer} from "../../../survey-tool/app/domain/survey";

@Component({
  selector: 'app-country-landing-page',
  templateUrl: 'country-landing-page.component.html'
})

export class CountryLandingPageComponent implements OnInit {

  countryCode: string = null;
  stakeholderId: string = null;
  surveyId: string = null;
  surveyAnswer: SurveyAnswer = null;

  constructor(private route: ActivatedRoute, private surveyService: SurveyService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.countryCode = params['code'];
        this.stakeholderId = 'sh-country-'+this.countryCode;
        // this.surveyService.getSurveys('stakeholderId', this.stakeholderId).subscribe(
        this.surveyService.getSurveys('type', 'country').subscribe(
          next => {
            this.surveyId = next.results[0].id;
            // TODO: REMOVE LINE BELLOW
            this.surveyId = 'm-GPFhURKK';
            // TODO: REMOVE LINE ABOVE
            this.surveyService.getLatestAnswer(this.stakeholderId, this.surveyId).subscribe(
              res=> {
                this.surveyAnswer = res;
              }
            );
          })
      }
    );
  }

}
