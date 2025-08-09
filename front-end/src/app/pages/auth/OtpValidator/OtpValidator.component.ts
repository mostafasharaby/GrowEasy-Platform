import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-OtpValidator',
  templateUrl: './OtpValidator.component.html',
  styleUrls: ['./OtpValidator.component.css']
})
export class OtpValidatorComponent implements OnInit {

otpForm: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otpData = { email: this.email, otp: this.otpForm.value.otp };
      this.authService.validateOtp(otpData).subscribe({
        next: response => {
          if (response.succeeded) {
            this.router.navigate(['/auth/set-password'], { queryParams: { email: this.email, otp: this.otpForm.value.otp } });
          }
        },
        error: err => console.error('OTP validation failed', err)
      });
    }
  }

}
