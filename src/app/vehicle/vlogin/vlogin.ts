import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { audit } from 'rxjs';

@Component({
  selector: 'app-vlogin',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './vlogin.html',
  styleUrl: './vlogin.scss',
})
export class Vlogin {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: Auth,
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], // Can be vehicleNo or mobile
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.auth.vehicleLogin(this.loginForm.value).subscribe({
        // this.http.post('http://localhost:5000/api/login', this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          alert(`Welcome back, ${res.vehicle.driverName}!`);

          // Store session data
          localStorage.setItem('driverId', res.vehicle.empId);
          localStorage.setItem('vehicleNo', res.vehicle.vehicleNo);

          // Navigate to dashboard (ensure you have this route defined)
          this.router.navigate(['/dashboard']);
        },

        error: (err) => {
          this.isSubmitting = false;
          alert(err.error.msg || 'Login failed. Please check your credentials.');
        },
      });
    }
  }
}
