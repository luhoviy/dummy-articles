import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'humanizedTime',
})
export class HumanizedTimePipe implements PipeTransform {
  transform(time: string): string {
    return !!time ? moment(time).fromNow() : '';
  }
}
