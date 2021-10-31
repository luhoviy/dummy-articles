import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainRoutesComponent } from './main-routes.component';
import { TestModule } from '../../test-utils/test.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { of } from 'rxjs';
import { logout } from '../../authentication/store';
import { By } from '@angular/platform-browser';

describe('MainRoutesComponent', () => {
  let component: MainRoutesComponent;
  let fixture: ComponentFixture<MainRoutesComponent>;
  let componentElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainRoutesComponent],
      imports: [TestModule, MatMenuModule, MatSidenavModule, MatListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe per screen width onInit', () => {
    // @ts-ignore
    spyOn(component.breakpointObserver, 'observe').and.returnValue(of({}));
    component.ngOnInit();
    // @ts-ignore
    expect(component.breakpointObserver.observe).toHaveBeenCalled();
  });

  it('test logout method', () => {
    // @ts-ignore
    spyOn(component.store, 'dispatch');
    component.logout();
    // @ts-ignore
    expect(component.store.dispatch).toHaveBeenCalledWith(logout());
  });

  describe('template test', () => {
    it('mat-sidenav should be presented if is mobile layout', () => {
      component.isDesktop = false;
      fixture.detectChanges();
      const sideNav = componentElement.querySelector('mat-sidenav');
      expect(sideNav).toBeTruthy();
    });

    it('mat-sidenav should be hidden if is not desktop layout', () => {
      component.isDesktop = true;
      fixture.detectChanges();
      const sideNav = componentElement.querySelector('mat-sidenav');
      expect(sideNav).toBeFalsy();
    });

    it('nav list should be always presented', () => {
      const navList = componentElement.querySelector(
        '.main-container__nav-list'
      );
      expect(navList).toBeTruthy();
    });

    it('nav list item should close sideNav onClick', () => {
      component.isDesktop = false;
      fixture.detectChanges();
      spyOn(component.sideNav, 'close');
      const navListItem = fixture.debugElement.queryAll(
        By.css('[mat-list-item]')
      )[0];
      navListItem.triggerEventHandler('click', {});
      expect(navListItem).toBeTruthy();
      expect(component.sideNav.close).toHaveBeenCalled();
    });
  });
});
