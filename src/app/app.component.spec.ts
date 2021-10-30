import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FileUploaderService } from './shared/services/file-uploader.service';
import { TestModule } from './test-utils/test.module';
import { NoConnectionModule } from './shared/components/no-connection/no-connection.module';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule,
        ServiceWorkerModule.register('', { enabled: false }),
        NgxSpinnerModule,
        NoConnectionModule,
      ],
      declarations: [AppComponent],
      providers: [FileUploaderService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
