/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpValidatorComponent } from './OtpValidator.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../auth-services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('OtpValidatorComponent', () => {
  let component: OtpValidatorComponent;
  let fixture: ComponentFixture<OtpValidatorComponent>;
  let mockAuthService: jasmine.SpyObj<AuthServiceService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthServiceService', ['validateOtp']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: { queryParams: { email: 'test@example.com' } }
    };

    await TestBed.configureTestingModule({
      declarations: [OtpValidatorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email from query params on init', () => {
    expect(component.email).toBe('test@example.com');
  });

  it('should mark form as invalid if OTP is empty', () => {
    component.otpForm.setValue({ otp: '' });
    expect(component.otpForm.invalid).toBeTrue();
    expect(component.otpForm.get('otp')!.hasError('required')).toBeTrue();
  });

  it('should call validateOtp and navigate on success', () => {
    component.otpForm.setValue({ otp: '123456' });
    mockAuthService.validateOtp.and.returnValue(of({ succeeded: true }));

    component.onSubmit();

    expect(mockAuthService.validateOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      otp: '123456'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/auth/set-password'],
      { queryParams: { email: 'test@example.com', otp: '123456' } }
    );
  });

  it('should log error when validateOtp fails', () => {
    spyOn(console, 'error');
    component.otpForm.setValue({ otp: '123456' });
    mockAuthService.validateOtp.and.returnValue(throwError(() => new Error('Invalid OTP')));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('OTP validation failed', jasmine.any(Error));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not call validateOtp if form is invalid', () => {
    component.otpForm.setValue({ otp: '' });
    component.onSubmit();
    expect(mockAuthService.validateOtp).not.toHaveBeenCalled();
  });

  it('should disable submit button when form is invalid', () => {
    component.otpForm.setValue({ otp: '' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTrue();
  });
});
