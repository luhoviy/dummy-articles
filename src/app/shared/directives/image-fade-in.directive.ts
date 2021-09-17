import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageFadeIn]',
})
export class ImageFadeInDirective {
  @HostListener('load', ['$event'])
  public onLoad(): void {
    this.imageRef.nativeElement.style.visibility = 'visible';
    this.imageRef.nativeElement.style.opacity = '1';
  }

  constructor(private imageRef: ElementRef<HTMLImageElement>) {
    this.imageRef.nativeElement.style.visibility = 'hidden';
    this.imageRef.nativeElement.style.opacity = '0';
    this.imageRef.nativeElement.style.pointerEvents = 'none';
    this.imageRef.nativeElement.style.userSelect = 'none';
    this.imageRef.nativeElement.style.transition = 'opacity 1s ease-out';
  }
}
