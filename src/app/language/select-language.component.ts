import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-language-component',
  templateUrl: './select-language.component.html',
})
export class SelectLanguageComponent {
  @ViewChild('newLanguageInput') newLanguageInput!: ElementRef;
  //newLanguage: string = '';
  constructor(public activeModal: NgbActiveModal) { }
  addLanguage() {
    const newLanguage = this.newLanguageInput.nativeElement.value.trim();
    if (newLanguage !== '') {
      this.activeModal.close(newLanguage);
    }
  }
}