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

      // this.register = this.fb.group({
    //   fullName: ['', [Validators.minLength(3), Validators.required]],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required]],
    //   confirmPassword: ['', [Validators.required]]
    // },
    //   {
    //     validators: this.passwordMatch(true, true) //function is invoked when the form group is created to return the actual validator function (Cross-Field Validation)
    //   });

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
  // exsitEmailValidation(arr: string[]): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => { //This is the base class for FormControl, FormGroup, and FormArray
  //     let emailValue: string = control.value;
  //     let validationErrors = { 'emailNotValid': { 'value': emailValue } }
  //     return (arr.includes(emailValue)) ? validationErrors : null;
  //   }
  // }
  // get fullName() {
  //   return this.register.get('fullName');
  // }
  // get email() {
  //   return this.register.get('email');
  // }
  // get password() {
  //   return this.register.get('password');
  // }
  // get confirmPassword() {
  //   return this.register.get('confirmPassword');
  // }

 

  // onRegister() {
  //   if (this.password?.value !== this.confirmPassword?.value) {
  //     this.toastr.error('Passwords do not match!');
  //     return;
  //   }
  //   if (this.register.valid) {
  //     this.authService.register(
  //       this.fullName?.value, 
  //       this.email?.value, 
  //       this.password?.value, 
  //       this.confirmPassword?.value
  //     ).subscribe({
  //       next: (response: any) => {
  //         console.log('User registered:', this.fullName?.value);
  //         this.router.navigate(['/auth/login']);  
  //         this.toastr.success('Registration successful');
  //         this.toastr.info('Please check your google account for verification');

  //       },
  //       error: (error: any) => {
  //         console.log('Registration failed:', error);  
  //           this.usernameTakenError = true;  
                  
  //       }
  //     });
  //   } else {
  //     this.toastr.error('Please fill out all fields correctly!');

  //   }
  // }

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




  


