import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { AuthServiceService } from '../auth-services/auth-service.service';
import { ForgotServiceService } from '../auth-services/forgot-service.service';
import { ResetPasswordService } from '../auth-services/resetPassword.service';
import { ModelService } from '../auth-services/model.service';
import { ReloadService } from '../../../shared/service/reload.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let reloadSpy: jasmine.SpyObj<ReloadService>;
  let forgotSpy: jasmine.SpyObj<ForgotServiceService>;
  let modelSpy: jasmine.SpyObj<ModelService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthServiceService', ['login', 'getUsernameFromToken', 'isRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    reloadSpy = jasmine.createSpyObj('ReloadService', ['initializeLoader']);
    forgotSpy = jasmine.createSpyObj('ForgotServiceService', ['forgetPassword']);
    modelSpy = jasmine.createSpyObj('ModelService', ['openDialog']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthServiceService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ReloadService, useValue: reloadSpy },
        { provide: ForgotServiceService, useValue: forgotSpy },
        { provide: ResetPasswordService, useValue: {} },
        { provide: ModelService, useValue: modelSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and init forms', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.forgetForm.get('emailForgot')).toBeTruthy();
    expect(component.resetForm.get('resetPassword')).toBeTruthy();
  });

  it('should validate loginForm fields', () => {
    const email = component.loginForm.get('email')!;
    const password = component.loginForm.get('password')!;
    email.setValue('invalid');
    expect(email.hasError('email')).toBeTrue();
    email.setValue('valid@mail.com');
    expect(email.hasError('email')).toBeFalse();
    password.setValue('12345');
    expect(password.hasError('minlength')).toBeTrue();
  });

  it('should handle successful login for admin', fakeAsync(() => {
    component.loginForm.setValue({ email: 'admin@example.com', password: '123456' });
    authSpy.login.and.returnValue(of({ succeeded: true }));
    authSpy.getUsernameFromToken.and.returnValue('admin@example.com');
    authSpy.isRole.and.returnValue(true);

    component.onSubmit(); tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin/dashboard']);
    expect(toastrSpy.success).toHaveBeenCalledWith('Welcome ADMIN@EXAMPLE.COM');
  }));

  it('should handle successful login for doctor', fakeAsync(() => {
    component.loginForm.setValue({ email: 'doc@example.com', password: '123456' });
    authSpy.login.and.returnValue(of({ succeeded: true }));
    authSpy.getUsernameFromToken.and.returnValue('doc@example.com');
    authSpy.isRole.and.callFake(r => r === 'doctor');

    component.onSubmit(); tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['doctor/doctor-appointments']);
  }));

  it('should handle successful login for user', fakeAsync(() => {
    component.loginForm.setValue({ email: 'user@example.com', password: '123456' });
    authSpy.login.and.returnValue(of({ succeeded: true }));
    authSpy.getUsernameFromToken.and.returnValue('user@example.com');
    authSpy.isRole.and.returnValue(false);

    component.onSubmit(); tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pages/home']);
  }));

  it('should handle login failure', fakeAsync(() => {
    spyOn(console, 'error');
    component.loginForm.setValue({ email: 'user@example.com', password: 'wrong' });
    authSpy.login.and.returnValue(throwError(() => new Error('Invalid')));

    component.onSubmit(); tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Login Failed');
    expect(component.errorMessage).toBe('Email or password is incorrect');
  }));

  it('should not submit if form invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should open forget password modal', () => {
    component.openForgetPasswordModal();
    expect(modelSpy.openDialog).toHaveBeenCalled();
  });

  it('should submit forgot password success', fakeAsync(() => {
    component.forgetForm.setValue({ emailForgot: 'u@mail.com' });
    forgotSpy.forgetPassword.and.returnValue(of({ message: 'ok' }));
    component.onForgotSubmit(); tick();
    expect(toastrSpy.success).toHaveBeenCalledWith('Success: ok');
  }));

  it('should submit forgot password fail', fakeAsync(() => {
    component.forgetForm.setValue({ emailForgot: 'u@mail.com' });
    forgotSpy.forgetPassword.and.returnValue(throwError(() => ({ message: 'fail' })));
    component.onForgotSubmit(); tick();
    expect(toastrSpy.error).toHaveBeenCalledWith('Error: fail');
  }));

  it('should call initializeLoader on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(reloadSpy.initializeLoader).toHaveBeenCalled();
  });

  it('should disable submit button when form invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBeTrue();
  });
});
