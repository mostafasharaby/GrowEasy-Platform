import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { EmailConfirmationService } from '../auth-services/email-confirmation.service';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let mockEmailService: jasmine.SpyObj<EmailConfirmationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockEmailService = jasmine.createSpyObj('EmailConfirmationService', ['confirmEmail']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    mockActivatedRoute = {
      queryParams: of({ userId: '123', token: 'abc-token' })
    };

    TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
        { provide: EmailConfirmationService, useValue: mockEmailService }
      ]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call confirmEmail when userId and token are provided', () => {
    mockEmailService.confirmEmail.and.returnValue(of({ message: 'Confirmed' }));
    component.ngOnInit();
    expect(mockEmailService.confirmEmail).toHaveBeenCalledWith('123', 'abc-token');
  });

  it('should set confirmationMessage and navigate on success', () => {
    mockEmailService.confirmEmail.and.returnValue(of({ message: 'Confirmed!' }));

    component.confirmEmail('123', 'abc-token');

    expect(component.confirmationMessage).toBe('Confirmed!');
    expect(mockToastr.success).toHaveBeenCalledWith('Email confirmed successfully.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.errorMessage).toBeNull();
  });

  it('should set errorMessage on failure', () => {
    mockEmailService.confirmEmail.and.returnValue(throwError(() => ({ error: 'Invalid token' })));

    component.confirmEmail('123', 'abc-token');

    expect(component.errorMessage).toBe('Invalid token');
    expect(mockToastr.error).toHaveBeenCalledWith('An error occurred while confirming your email.');
    expect(component.confirmationMessage).toBeNull();
  });

});
