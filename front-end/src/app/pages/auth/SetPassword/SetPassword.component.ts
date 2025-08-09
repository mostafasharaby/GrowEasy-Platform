import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-services/auth-service.service';
@Component({
  selector: 'app-SetPassword',
  templateUrl: './SetPassword.component.html',
  styleUrls: ['./SetPassword.component.css']
})
export class SetPasswordComponent implements OnInit {

passwordForm: FormGroup;
  email: string = '';
  otp: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
    this.otp = this.route.snapshot.queryParams['otp'];
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const passwordData = {
        email: this.email,
        otp: this.otp,
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword
      };
      this.authService.setPassword(passwordData).subscribe({
        next: response => {
          if (response.succeeded) {
            this.router.navigate(['/auth/login']);
          }
        },
        error: err => console.error('Password setting failed', err)
      });
    }
  }
}
