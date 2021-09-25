import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../animations';
import { NotificationsService } from '../../services/notifications.service';
import { isEmpty, last } from 'lodash';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  animations: [fadeIn],
})
export class FileUploaderComponent {
  @Input() showDropzone: boolean = true;
  @Output() fileUploaded = new EventEmitter<string>();
  showDragoverBox: boolean = false;

  constructor(private notifications: NotificationsService) {}

  public onFileUpload(event: DragEvent | Event): void {
    const files: FileList =
      event instanceof DragEvent
        ? event.dataTransfer.files
        : event.target['files'];
    if (isEmpty(files)) return;

    const file = last(files);
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/jpg' &&
      file.type !== 'image/png'
    ) {
      this.notifications.error(
        'Invalid file extension! Please upload file with PNG or JPG extension.'
      );
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file as Blob);
    fileReader.onload = () =>
      this.fileUploaded.emit(fileReader.result as string);

    if (!(event instanceof DragEvent)) {
      event.target['value'] = '';
    }
  }
}
