import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';

// @Directive({
//   selector: '[appContactValidator]'
// })

export function contactValidator(nameRe: RegExp) {
  return (control: AbstractControl): {[key:string]: any} | null => {
    const invalid = nameRe.test(control.value)
    return invalid ? null : {'invalidContact': {value: control.value}}
  }
}
