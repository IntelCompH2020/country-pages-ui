import {Component} from "@angular/core";
import {
  ContributionsHomeComponent
} from "../../../../survey-tool/app/pages/contributions-dashboard/home/contributions-home.component";

@Component({
  selector: 'app-contributions-ext-home',
  templateUrl: './contributions-home-extension.component.html'
})

export class ContributionsHomeExtensionComponent extends ContributionsHomeComponent {

  title: string = 'Welcome to your personalized section of the IntelComp Policy Participation Portal!';
  text: string = '<p>Here, you can effortlessly complete your assigned surveys, gaining valuable insights and contributing to important discussions.</p>' +
    '<p>Moreover, you have the ability to assign portions of the survey to selected contributors. This collaborative approach ensures comprehensive coverage of topics, leveraging the expertise of various individuals to enrich the overall survey quality.</p>' +
    '<p>Stay informed, collaborate, and contribute to meaningful surveys! Start by selecting a survey on the left.</p>';

}
