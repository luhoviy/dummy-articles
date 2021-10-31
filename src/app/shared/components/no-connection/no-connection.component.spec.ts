import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoConnectionComponent } from './no-connection.component';
import { TestModule } from '../../../test-utils/test.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { getIsNetworkOnline } from '../../../store/selectors/app.selectors';

describe('NoConnectionComponent', () => {
  let component: NoConnectionComponent;
  let fixture: ComponentFixture<NoConnectionComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoConnectionComponent],
      imports: [TestModule, MatProgressSpinnerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoConnectionComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template test', () => {
    let noConnectionContainer: HTMLDivElement;

    beforeEach(() => {
      store.overrideSelector(getIsNetworkOnline, false);
      noConnectionContainer = fixture.debugElement.nativeElement.querySelector(
        '.no-connection-container'
      );
    });

    it('no connection container should be rendered', () => {
      expect(noConnectionContainer).toBeTruthy();
    });

    it('no connection message should be presented as well', () => {
      const textWrapper = noConnectionContainer.querySelector('.mat-body');
      expect(textWrapper.textContent).toContain(
        'No internet connection. Trying to reconnect...'
      );
    });
  });
});
