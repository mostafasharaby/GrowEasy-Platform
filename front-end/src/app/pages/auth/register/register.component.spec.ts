/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RegisterComponent } from './register.component';
import { AuthServiceService } from '../auth-services/auth-service.service';
import { ReloadService } from '../../../shared/service/reload.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let reloadSpy: jasmine.SpyObj<ReloadService>;

  const validData = {
    arabicName: 'شركة اختبار',
    englishName: 'Test Company',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    websiteUrl: 'https://test.com',
    logo: null,
    password: 'Password123!'
  };

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthServiceService', ['registerCompany']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['info']);
    reloadSpy = jasmine.createSpyObj('ReloadService', ['initializeLoader']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthServiceService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ReloadService, useValue: reloadSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize form controls', () => {
    expect(component).toBeTruthy();
    ['arabicName', 'englishName', 'email', 'phoneNumber', 'websiteUrl', 'logo', 'password']
      .forEach(ctrl => expect(component.signupForm.get(ctrl)).toBeTruthy());
  });

  it('should mark empty required fields as invalid and validate email format', () => {
    expect(component.signupForm.valid).toBeFalse();
    const email = component.signupForm.get('email')!;
    email.setValue('bad');
    expect(email.hasError('email')).toBeTrue();
    email.setValue('good@mail.com');
    expect(email.hasError('email')).toBeFalse();
  });

  it('should handle file upload and set preview', () => {
    const file = new File([''], 'logo.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;
    spyOn(window, 'FileReader').and.returnValue({
      readAsDataURL: jasmine.createSpy(),
      onload: null,
      result: 'data:image/png;base64,abc123'
    } as any);

    component.onFileChange(event);
    expect(component.signupForm.get('logo')!.value).toBe(file);
    expect(component.logoPreview).toBe('data:image/png;base64,abc123');
  });

  it('should submit and navigate to OTP validator on success', fakeAsync(() => {
    component.signupForm.setValue(validData);
    authSpy.registerCompany.and.returnValue(of({ succeeded: true }));

    component.onSubmit(); tick();

    expect(authSpy.registerCompany).toHaveBeenCalledWith(jasmine.any(FormData));
    expect(toastrSpy.info).toHaveBeenCalledWith('Please check your google account for verification');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/otp-validator'], {
      queryParams: { email: 'test@example.com' }
    });
  }));

  it('should not submit when form invalid', () => {
    component.signupForm.reset();
    component.onSubmit();
    expect(authSpy.registerCompany).not.toHaveBeenCalled();
  });

  it('should handle registration failure', fakeAsync(() => {
    component.signupForm.setValue(validData);
    spyOn(console, 'error');
    authSpy.registerCompany.and.returnValue(throwError(() => new Error('fail')));

    component.onSubmit(); tick();

    expect(console.error).toHaveBeenCalledWith('Registration failed', jasmine.any(Error));
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('should call initializeLoader after view init', () => {
    component.ngAfterViewInit();
    expect(reloadSpy.initializeLoader).toHaveBeenCalled();
  });

  it('should render logo preview if set', () => {
    component.logoPreview = 'data:image/png;base64,abc123';
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img.logo-preview')).nativeElement;
    expect(img.src).toBe('data:image/png;base64,abc123');
  });

  it('should disable submit button when form invalid', () => {
    component.signupForm.reset();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(btn.disabled).toBeTrue();
  });
});
