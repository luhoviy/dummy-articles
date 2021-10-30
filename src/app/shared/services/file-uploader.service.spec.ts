import { TestBed } from '@angular/core/testing';
import { FileUploaderService } from './file-uploader.service';
import { of } from 'rxjs';
import { TestModule } from '../../test-utils/test.module';

describe('FileUploaderService', () => {
  let service: FileUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    service = TestBed.inject(FileUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test uploadFileToFireStorage method', () => {
    const mockStorageRef = {
      putString: (...args) => null,
      getDownloadURL: () => null,
    };
    const mockUploadTask = {
      percentageChanges: () => null,
      snapshotChanges: () => null,
    };

    // @ts-ignore
    spyOn(service.storage, 'ref').and.returnValue(mockStorageRef);
    spyOn(mockStorageRef, 'putString').and.returnValue(mockUploadTask);
    spyOn(mockStorageRef, 'getDownloadURL').and.returnValue(of(null));
    spyOn(mockUploadTask, 'percentageChanges').and.returnValue(of(100));
    spyOn(mockUploadTask, 'snapshotChanges').and.returnValue(
      of({ state: 'success' })
    );
    spyOn(service.uploadingProgress$, 'next');

    service.uploadFileToFireStorage('path', 'fileData');

    // @ts-ignore
    expect(service.storage.ref).toHaveBeenCalledWith('path');
    expect(mockStorageRef.putString).toHaveBeenCalledWith(
      'fileData',
      'data_url',
      {
        cacheControl: 'private, max-age=172800',
      }
    );
    expect(mockUploadTask.percentageChanges).toHaveBeenCalled();
    expect(service.uploadingProgress$.next).toHaveBeenCalledWith(100);
    expect(service.uploadingProgress$.next).toHaveBeenCalledWith(0);
    expect(service.uploadingProgress$.next).toHaveBeenCalledTimes(2);
  });
});
