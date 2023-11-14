import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DisableSection, Field, HandleBitSet} from "../../../../domain/dynamic-form-model";
import {FormArray, FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html'
})

export class CheckboxFieldComponent implements OnInit {
  @Input() fieldData: Field;
  @Input() editMode: any;
  @Input() position?: number = null;

  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() disableChapter = new EventEmitter<DisableSection>();
  @Output() handleBitSets = new EventEmitter<Field>();
  @Output() handleBitSetsOfComposite = new EventEmitter<HandleBitSet>();

  formControl!: FormControl;
  form!: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.position !== null) {
      this.form = this.rootFormGroup.control.controls[this.position] as FormGroup;
    } else {
      this.form = this.rootFormGroup.control;
    }
    // console.log(this.form);

    this.formControl = this.form.get(this.fieldData.name) as FormControl;
    // console.log(this.formControl);
    if (this.fieldData.form.affects?.length > 0) {
      this.chapterEdit(this.fieldData.form.affects[0].name, this.rootFormGroup.form.get(this.fieldData.name).value);
      this.rootFormGroup.form.get(this.fieldData.name).valueChanges.subscribe(
        next => {
          this.chapterEdit(this.fieldData.form.affects[0].name, next);
        }
      );
    }
  }

  /** Handle Arrays --> **/

  fieldAsFormArray() {
    return this.formControl as unknown as FormArray;
  }

  push(field: string, required: boolean) {
    this.fieldAsFormArray().push(required ? new FormControl(null, Validators.required) : new FormControl(null));
  }

  remove(field: string, i: number) {
    this.fieldAsFormArray().removeAt(i);
  }

  /** check fields validity--> **/

  checkFormValidity(): boolean {
    return (!this.formControl.valid && (this.formControl.touched || this.formControl.dirty));
  }

  checkFormArrayValidity(name: string, position: number, edit: boolean, groupName?: string): boolean {
    if (groupName) {
      return (!this.fieldAsFormArray()?.get([position])?.get(groupName).valid
        && (edit || this.fieldAsFormArray()?.get([position])?.get(groupName).dirty));

    }
    return (!this.fieldAsFormArray().get([position]).valid
      && (edit || this.fieldAsFormArray().get([position]).dirty));
  }

  /** Bitsets--> **/

  updateBitSet(fieldData: Field) {
    this.timeOut(200).then(() => { // Needed for radio buttons strange behaviour
      if (fieldData.form.mandatory) {
        this.handleBitSets.emit(fieldData);
      }
    });
  }

  /** other stuff--> **/
  unsavedChangesPrompt() {
    this.hasChanges.emit(true);
  }

  chapterEdit(name: string, enable: boolean) {
    let data: DisableSection = new class implements DisableSection {
        enable: boolean;
        name: string;
    };
    data.name = name;
    data.enable = enable;
    this.disableChapter.emit(data);
  }

  timeOut(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
