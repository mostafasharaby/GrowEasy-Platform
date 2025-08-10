import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { LogoutComponent } from './logout.component';
import { AuthServiceService } from '../auth-services/auth-service.service';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceService>;
  let reloadSpy: jasmine.Spy;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthServiceService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    reloadSpy = spyOn(window.location, 'reload').and.callFake(() => {});

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should call logout and navigate to login page on confirmLogout', () => {
    spyOn(console, 'log');

    component.confirmLogout();

    expect(console.log).toHaveBeenCalledWith('Logging out...');
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should navigate to home page on cancelLogout', () => {
    spyOn(console, 'log');

    component.cancelLogout();

    expect(console.log).toHaveBeenCalledWith('Logout cancelled.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pages/home']);
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
  });

  it('should trigger confirmLogout when confirm button is clicked', () => {
    spyOn(component, 'confirmLogout');
    const confirmButton = fixture.debugElement.query(By.css('.confirm-logout-btn'));

    confirmButton?.triggerEventHandler('click', null);

    expect(component.confirmLogout).toHaveBeenCalled();
  });

  it('should trigger cancelLogout when cancel button is clicked', () => {
    spyOn(component, 'cancelLogout');
    const cancelButton = fixture.debugElement.query(By.css('.cancel-logout-btn'));

    cancelButton?.triggerEventHandler('click', null);

    expect(component.cancelLogout).toHaveBeenCalled();
  });
});
