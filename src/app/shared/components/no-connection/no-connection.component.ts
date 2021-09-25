import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getIsNetworkOnline } from '../../../store/selectors/app.selectors';
import { fadeFromLeft } from '../../animations';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.component.html',
  styleUrls: ['./no-connection.component.scss'],
  animations: [fadeFromLeft],
})
export class NoConnectionComponent {
  isOnline: Observable<boolean> = this.store.select(getIsNetworkOnline);

  constructor(private store: Store) {}
}
