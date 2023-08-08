import {UsersService} from "../services/users.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";

export class EmailExistsValidator{
  static validate(userService: UsersService) : AsyncValidatorFn{
    return (control : AbstractControl): Observable<ValidationErrors | null> =>{
      console.log('get here');
      return userService.checkIfEmailExist(control.value).pipe(
        map((result : boolean) => result ? { emailAlreadyExist:true} : null)
      )
    }
  }
}
