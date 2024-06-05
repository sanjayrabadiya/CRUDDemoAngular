import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from '../services/language.service';
import { Language } from './../data-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-select-language-component',
  templateUrl: './select-language.component.html',
})
export class SelectLanguageComponent implements OnInit {
  languageList: Language[] = [];  
  languageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal, 
    private languageService: LanguageService,
    private toastr: ToastrService,
  ){
    this.languageForm = this.fb.group({
      name: ['', Validators.required],
    });   
  }

  ngOnInit() {
    this.loadlanguageList();
  }

  loadlanguageList() {
    this.languageService.getLanguages().subscribe(
      (languages: Language[]) => {
        this.languageList = languages;
      },
      (error) => {
        console.error('Error fetching language list:', error);
      }
    );
  }   

  addLanguage() {    
    this.languageService.createLanguage(this.languageForm.value).subscribe(
      () => {
        this.toastr.success('language created successfully!');
        this.loadlanguageList();
        this.languageForm.reset();       
      },
      (error) => {
        this.toastr.error('Error creating language:', error);
      }
    );
  }
  close(){
    this.activeModal.close();

  }
}
