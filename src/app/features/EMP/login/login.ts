import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
  ) {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          // console.log('Registered! Your New EMPID is:', res.empId);
          console.log('Login Successful! Welcome:', res.user.name);

          // Save token and empId to localStorage for session persistence
          localStorage.setItem('token', res.token);
          localStorage.setItem('empId', res.user.empId);
          // You can store the empId or show it in a message
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert(err.error.msg || 'Something went wrong');
        },
      });
    }
  }
}
