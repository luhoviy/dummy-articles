import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeFromLeft = trigger('fadeFromLeftState', [
  state(
    'shown',
    style({
      transform: 'translateX(0)',
      opacity: 1,
      visibility: 'visible',
    })
  ),
  state(
    'hidden',
    style({
      transform: 'translateX(-30%)',
      opacity: 0,
      visibility: 'hidden',
    })
  ),
  transition('hidden <=> shown', [animate('.2s')]),
]);

export const fadeIn = trigger('fadeInState', [
  state(
    'shown',
    style({
      opacity: 1,
      visibility: 'visible',
    })
  ),
  state(
    'hidden',
    style({
      opacity: 0,
      visibility: 'hidden',
    })
  ),
  transition('hidden => shown', [animate('.4s')]),
]);

export const fadeInOut = trigger('fadeInOutState', [
  state(
    'shown',
    style({
      opacity: 1,
      visibility: 'visible',
    })
  ),
  state(
    'hidden',
    style({
      opacity: 0,
      visibility: 'hidden',
    })
  ),
  transition('hidden <=> shown', [animate('.3s')]),
]);
