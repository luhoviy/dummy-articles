import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[imageSkeletonWrapper]',
})
export class ImageSkeletonWrapperDirective implements AfterViewInit, OnDestroy {
  destroy$ = new Subject<void>();
  isResponsive: boolean = true;
  wrapperElement: HTMLDivElement;
  @Input() sizeUnit: 'vw' | 'vh' | 'rem' | 'em' | 'px' = 'vw';
  @Input() rounded: boolean = true;

  @Input() set size(value: string | number) {
    if (!!!value) {
      this.makeResponsive();
      return;
    }

    value =
      typeof value === 'string'
        ? value.replace(/[^\d]/g, '') + this.sizeUnit
        : value + this.sizeUnit;

    this.isResponsive = false;
    if (this.rounded) this.wrapperElement.style.borderRadius = '50%';
    this.wrapperElement.classList.remove('responsive');
    this.wrapperElement.style.width = this.wrapperElement.style.height = value;
  }

  constructor(private wrapperRef: ElementRef<HTMLDivElement>) {
    this.wrapperElement = this.wrapperRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.isResponsive) this.makeResponsive();
    const targetImage: HTMLImageElement =
      this.wrapperElement.querySelector('img');
    if (!targetImage) return;

    merge(fromEvent(targetImage, 'load'), fromEvent(targetImage, 'error'))
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((event) =>
        event.type === 'load'
          ? this.wrapperElement.classList.add('loaded')
          : targetImage.remove()
      );
  }

  private makeResponsive(): void {
    this.wrapperElement.classList.add('responsive');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
