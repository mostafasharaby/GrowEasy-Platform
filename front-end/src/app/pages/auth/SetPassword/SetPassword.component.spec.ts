/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SetPasswordComponent } from './SetPassword.component';
import { AuthServiceService } from '../auth-services/auth-service.service';

describe('SetPasswordComponent', () => {
  let component: SetPasswordComponent;
  let fixture: ComponentFixture<SetPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthServiceService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthServiceService', ['setPassword']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [SetPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                email: 'test@example.com',
                otp: '123456'
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should read email and otp from query params on init', () => {
    component.ngOnInit();
    expect(component.email).toBe('test@example.com');
    expect(component.otp).toBe('123456');
  });

  it('should invalidate form when passwords do not match', () => {
    component.passwordForm.setValue({ newPassword: 'Pass@123', confirmPassword: 'Pass@124' });
    expect(component.passwordForm.errors).toEqual({ mismatch: true });
  });

  it('should call authService.setPassword and navigate on success', () => {
    component.passwordForm.setValue({ newPassword: 'Pass@123', confirmPassword: 'Pass@123' });
    mockAuthService.setPassword.and.returnValue(of({ succeeded: true }));

    component.onSubmit();

    expect(mockAuthService.setPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      otp: '123456',
      newPassword: 'Pass@123',
      confirmPassword: 'Pass@123'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should not call service if form is invalid', () => {
    component.passwordForm.setValue({ newPassword: '', confirmPassword: '' });
    component.onSubmit();
    expect(mockAuthService.setPassword).not.toHaveBeenCalled();
  });

  it('should handle service error without navigation', () => {
    component.passwordForm.setValue({ newPassword: 'Pass@123', confirmPassword: 'Pass@123' });
    mockAuthService.setPassword.and.returnValue(throwError(() => new Error('fail')));

    component.onSubmit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
