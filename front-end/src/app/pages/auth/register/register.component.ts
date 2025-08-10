import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-services/auth-service.service';
import { User } from '../user-model/user';
import { ReloadService } from '../../../shared/service/reload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit,AfterViewInit {

  ngAfterViewInit(): void {   
    this.reload.initializeLoader();
  }
  ngOnInit() {
  }

  user: User = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  signupForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;



  // register: FormGroup;
  usernameTakenError: boolean = false;
  constructor(private fb: FormBuilder,
    private router: Router,
    private reload : ReloadService,
    private toastr: ToastrService,
    private authService: AuthServiceService
  ) {
  

      this.signupForm = this.fb.group({
      arabicName: ['', Validators.required],
      englishName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      websiteUrl: [''],
      logo: [null],
      password: ['', Validators.required]
    });

  }


  passwordMatch(complexPassword: boolean = false, complexPasswordWithFullName: boolean = false): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      let pas = formGroup.get('password');
      let confirm = formGroup.get('confirmPassword');
      let email = formGroup.get('email');
      let fullName = formGroup.get('fullName');

      if (!pas && !confirm && !email && !fullName) return null;
      let pasVal = pas?.value;
      let confirmVal = confirm?.value;
      let emailVal = email?.value;
      let fullNameVal = fullName?.value;

      if (pasVal !== confirmVal) {
        return { notMatchPassword: true };
      }
      if (complexPassword && pasVal == emailVal) {
        return { complexPassword: true };
      }
      if (complexPasswordWithFullName && pasVal == fullNameVal) {
        return { complexPasswordWithFullName: true };
      }
      return null;
    }
  }


    onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.signupForm.patchValue({ logo: file });

      const reader = new FileReader();
      reader.onload = () => (this.logoPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = new FormData();
      Object.keys(this.signupForm.value).forEach(key => {
        if (key === 'logo' && this.signupForm.value[key]) {
          console.log(key)
          formData.append(key, this.signupForm.value[key]);
        } else {
          formData.append(key, this.signupForm.value[key]);
        }
      });

      console.log("data",formData)
      this.authService.registerCompany(formData).subscribe({
        next: response => {
          if (response.succeeded) {
            this.router.navigate(['/auth/otp-validator'], { queryParams: { email: this.signupForm.value.email } });
             this.toastr.info('Please check your google account for verification');
          }
        },
        error: err => console.error('Registration failed', err)
      });
    }
  }


  }




  


