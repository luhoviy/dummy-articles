import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { FileUploaderService } from './shared/services/file-uploader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private serviceWorkerUpdates: SwUpdate,
    public fileUploader: FileUploaderService
  ) {
    if (this.serviceWorkerUpdates.isEnabled) {
      this.serviceWorkerUpdates.available.subscribe(async () => {
        try {
          await this.serviceWorkerUpdates.activateUpdate();
          document.location.reload();
        } catch (error) {
          console.error('SwUpdate error', error);
        }
      });
    }
  }
}
