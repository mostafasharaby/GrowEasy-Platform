import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from './header.component';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthServiceService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let loggedStatus$: Subject<boolean>;

  beforeEach(() => {
    loggedStatus$ = new Subject<boolean>();

    mockAuthService = jasmine.createSpyObj('AuthServiceService', [
      'getloggedStatus',
      'getCompanyDetails'
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to logged status and update isLoggedIn', () => {
    mockAuthService.getloggedStatus.and.returnValue(loggedStatus$.asObservable());
    mockAuthService.getCompanyDetails.and.returnValue(of({ succeeded: true, data: {} }));

    component.ngOnInit();
    loggedStatus$.next(false);

    expect(component.isLoggedIn).toBe(false);

    loggedStatus$.next(true);
    expect(component.isLoggedIn).toBe(true);
  });

  it('should fetch company details on init', () => {
    const companyData = { logoPath: '/logo.png', companyNameEnglish: 'Test Co' };
    mockAuthService.getloggedStatus.and.returnValue(of(true));
    mockAuthService.getCompanyDetails.and.returnValue(of({ succeeded: true, data: companyData }));

    component.ngOnInit();

    expect(component.company).toEqual(companyData);
  });

  it('should toggle navbar collapsed state', () => {
    expect(component.isCollapsed).toBe(true);
    component.toggleNavbar();
    expect(component.isCollapsed).toBe(false);
    component.toggleNavbar();
    expect(component.isCollapsed).toBe(true);
  });

  it('should toggle drawer open state', () => {
    expect(component.isDrawerOpen).toBe(false);
    component.toggleDrawer();
    expect(component.isDrawerOpen).toBe(true);
    component.toggleDrawer();
    expect(component.isDrawerOpen).toBe(false);
  });

  it('should unsubscribe from loggedStatusSubscription on destroy', () => {
    const unsubscribeSpy = spyOn(Subject.prototype, 'unsubscribe');
    mockAuthService.getloggedStatus.and.returnValue(loggedStatus$.asObservable());
    mockAuthService.getCompanyDetails.and.returnValue(of({ succeeded: true, data: {} }));

    component.ngOnInit();
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
