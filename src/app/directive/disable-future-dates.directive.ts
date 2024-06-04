import { Directive, HostBinding, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableFutureDates][formControlName],[appDisableFutureDates][formControl],[appDisableFutureDates][ngModel]'
})
export class DisableFutureDatesDirective {

  constructor(public ngControl: NgControl) {}

  @HostBinding('style.background-color') backgroundColor: string = 'inherit';

  @HostListener('input', ['$event.target.value']) onInput(value: string) {
    const currentDate = new Date().toISOString().split('T')[0];
    if (value > currentDate) {
      this.ngControl.control?.setValue('');
    }
    this.backgroundColor = value > currentDate ? 'lightgray' : 'inherit';
  }
}