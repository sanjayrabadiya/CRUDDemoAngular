import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-language-component',
  templateUrl: './select-language.component.html',
})
export class SelectLanguageComponent {
  newLanguage: string = '';
  constructor(public activeModal: NgbActiveModal) { }
  addLanguage() {
    if (this.newLanguage.trim() !== '') {
      this.activeModal.close(this.newLanguage.trim());
    } 
  }
}