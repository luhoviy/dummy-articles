import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[imgLoadingContainer]',
})
export class ImgLoadingContainerDirective
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() size: number;
  @Input() sizeUnit: 'vw' | 'vh' | 'rem' | 'em' | 'px' = 'vw';
  @Input() src: string;
  @Input() alt: string = 'img';
  destroy$ = new Subject<void>();

  constructor(private wrapperRef: ElementRef<HTMLDivElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const srcChange = changes.src;
    if (!!srcChange && !srcChange.firstChange) {
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit(): void {
    const container = this.wrapperRef.nativeElement;
    container.classList.remove('loaded');
    if (!!this.size) {
      container.style.width = container.style.height =
        this.size + this.sizeUnit;
      container.style.borderRadius = '50%';
    } else {
      container.classList.add('responsive');
    }

    let targetImage = container.querySelector('img');
    if (!targetImage) {
      targetImage = document.createElement('img');
      container.appendChild(targetImage);
    }
    targetImage.src = this.src || '';
    targetImage.alt = this.alt;

    merge(fromEvent(targetImage, 'load'), fromEvent(targetImage, 'error'))
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((event) =>
        event.type === 'load'
          ? container.classList.add('loaded')
          : targetImage.remove()
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
