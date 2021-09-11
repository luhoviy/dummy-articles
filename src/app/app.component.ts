import { Component } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'dummy-articles';

  constructor(private serviceWorkerUpdates: SwUpdate) {
    if (this.serviceWorkerUpdates.isEnabled) {
      this.serviceWorkerUpdates.available.subscribe(async () => {
        try {
          await this.serviceWorkerUpdates.activateUpdate();
          document.location.reload();
        } catch (error) {
          console.error("SwUpdate error", error)
        }
      })
    }
  }
}
