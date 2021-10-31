import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploaderComponent } from './file-uploader.component';
import { TestModule } from '../../../test-utils/test.module';

describe('FileUploaderComponent', () => {
  let component: FileUploaderComponent;
  let fixture: ComponentFixture<FileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploaderComponent],
      imports: [TestModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onFileUpload method should present an error snackbar if uploaded file type is invalid', () => {
    const mockEvent: any = { target: { files: [{ type: 'invalid' }] } };
    // @ts-ignore
    spyOn(component.notifications, 'error');
    component.onFileUpload(mockEvent);
    // @ts-ignore
    expect(component.notifications.error).toHaveBeenCalledWith(
      'Invalid file extension! Please upload file with PNG or JPG extension.'
    );
  });
});
