import { FileUploaderDirective } from './file-uploader.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <div
    appFileUploader
    (onFileDrop)="onFileUpload($event)"
    (dragActive)="onDragStateChange($event)"
  ></div>`,
})
class TestFileUploaderComponent {
  onFileUpload($event: DragEvent | Event): void {}

  onDragStateChange($event: boolean): void {}
}

describe('FileUploaderDirective', () => {
  let directive: FileUploaderDirective;
  let component: TestFileUploaderComponent;
  let fixture: ComponentFixture<TestFileUploaderComponent>;
  let targetElement: DebugElement;
  const mockEvent = {
    preventDefault: () => null,
    stopPropagation: () => null,
  };

  beforeEach(() => {
    directive = new FileUploaderDirective();
    TestBed.configureTestingModule({
      declarations: [TestFileUploaderComponent, FileUploaderDirective],
    });
    fixture = TestBed.createComponent(TestFileUploaderComponent);
    component = fixture.componentInstance;
    targetElement = fixture.debugElement.query(By.css('div'));
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should emit true on dragover event', () => {
    spyOn(directive.dragActive, 'emit');
    spyOn(component, 'onDragStateChange');
    // @ts-ignore
    directive.onDragOver(mockEvent);
    targetElement.triggerEventHandler('dragover', mockEvent);
    fixture.detectChanges();
    expect(directive.dragActive.emit).toHaveBeenCalledWith(true);
    expect(component.onDragStateChange).toHaveBeenCalledWith(true);
  });

  it('should emit false on dragleave event', () => {
    spyOn(directive.dragActive, 'emit');
    spyOn(component, 'onDragStateChange');
    // @ts-ignore
    directive.onDragLeave(mockEvent);
    targetElement.triggerEventHandler('dragleave', mockEvent);
    fixture.detectChanges();
    expect(directive.dragActive.emit).toHaveBeenCalledWith(false);
    expect(component.onDragStateChange).toHaveBeenCalledWith(false);
  });

  it('should emit dragEvent on drop', () => {
    spyOn(directive.onFileDrop, 'emit');
    spyOn(component, 'onFileUpload');
    // @ts-ignore
    directive.onDrop(mockEvent);
    targetElement.triggerEventHandler('drop', mockEvent);
    fixture.detectChanges();
    expect(directive.onFileDrop.emit).toHaveBeenCalledWith(
      mockEvent as DragEvent
    );
    expect(component.onFileUpload).toHaveBeenCalledWith(mockEvent as DragEvent);
  });
});
