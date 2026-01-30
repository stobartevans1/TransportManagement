import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
})
export class Register {
  empId = '';
  name = '';
  password = '';
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        gmail: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }
 
  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Registered! Your New EMPID is:', res.empId);
          // You can store the empId or show it in a message
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert(err.error.msg || 'Something went wrong');
        },
      });
    }
   
  }
}
