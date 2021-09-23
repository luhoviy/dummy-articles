import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileUploader]',
})
export class FileUploaderDirective {
  @Output() dragActive = new EventEmitter<boolean>();
  @Output() onFileDrop = new EventEmitter<DragEvent>();

  @HostListener('dragover', ['$event'])
  private onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  private onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.emit(false);
  }

  @HostListener('drop', ['$event'])
  private onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.emit(false);
    this.onFileDrop.emit(event);
  }
}
