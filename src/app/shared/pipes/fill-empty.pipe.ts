import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from 'lodash';

@Pipe({
  name: 'fillEmpty',
})
export class FillEmptyPipe implements PipeTransform {
  transform(value: any, valueToDisplay: string = 'Not specified'): unknown {
    return isEmpty(value) ? valueToDisplay : value;
  }
}
