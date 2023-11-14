import {Component} from "@angular/core";
import {
  ContributionsHomeComponent
} from "../../../../survey-tool/app/pages/contributions-dashboard/home/contributions-home.component";

@Component({
  selector: 'app-contributions-ext-home',
  templateUrl: './contributions-home-extension.component.html'
})

export class ContributionsHomeExtensionComponent extends ContributionsHomeComponent {

  title: string = 'Intelcomp Survey Title';
  text: string = 'Description';

}
