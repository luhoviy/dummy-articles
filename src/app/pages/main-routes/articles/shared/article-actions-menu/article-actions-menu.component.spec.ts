import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleActionsMenuComponent } from './article-actions-menu.component';

describe('ArticleActionsMenuComponent', () => {
  let component: ArticleActionsMenuComponent;
  let fixture: ComponentFixture<ArticleActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleActionsMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
