import { Injectable } from '@angular/core';
import { createEffect } from "@ngrx/effects";
import { fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";
import { updateNetworkState } from "./store/actions/network.actions";

@Injectable({
  providedIn: 'root'
})

export class AppEffects {

  observeNetworkState$ = createEffect(() =>
    merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(
      map(event => updateNetworkState({ isOnline: event.type === 'online' }))
    )
  )

}
