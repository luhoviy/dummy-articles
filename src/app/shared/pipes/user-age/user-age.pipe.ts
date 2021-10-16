import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'userAge',
})
export class UserAgePipe implements PipeTransform {
  transform(birthDate: string): number {
    return !!birthDate ? moment().diff(moment(birthDate), 'years') : null;
  }
}
