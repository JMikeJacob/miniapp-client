import { Directive } from '@angular/core'
import { FormArray } from '@angular/forms'

@Directive({
  selector: '[appDuplicateValidator]'
})
export class DuplicateValidatorDirective {

  constructor() { }
  
  duplicateValidator() {
    return (form: FormArray): {[key:string]: any} | null => {
      console.log(form.length)
      if(form.length > 1) {
        let counts = []
        for(let i = 0; i < form.length; i++) {
          console.log(form.controls[i].value)
          if(!counts[form.controls[i].value]) {
            counts[form.controls[i].value] = 1
          }
          else {
            return {'duplicateValue': {value: form.controls[i].value}}
          }
        }
      }
      return null
    }
  }

}
