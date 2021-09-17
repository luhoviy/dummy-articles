import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getNetworkOnlineState } from '../../../store/selectors/network.selectors';
import { fadeFromLeft } from '../../animations';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.component.html',
  styleUrls: ['./no-connection.component.scss'],
  animations: [fadeFromLeft],
})
export class NoConnectionComponent implements OnInit {
  isOnline: Observable<boolean> = this.store.select(getNetworkOnlineState);

  constructor(private store: Store) {}

  ngOnInit(): void {}
}
