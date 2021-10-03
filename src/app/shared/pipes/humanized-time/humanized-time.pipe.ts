import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'humanizedTime',
})
export class HumanizedTimePipe implements PipeTransform {
  transform(time: string): string {
    return !!time
      ? moment.duration(moment(time).diff(moment())).get('months') < 0
        ? moment(time).format('MMM DD, YYYY')
        : moment(time).fromNow()
      : '';
  }
}
