import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vregister',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './vregister.html',
  styleUrl: './vregister.scss',
})
export class VRegister {
  vehicleForm: FormGroup;
  isSubmitting = false;

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
  ) {
    this.vehicleForm = this.fb.group({
      driverName: ['', [Validators.required, Validators.minLength(3)]],
      vehicleNo: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$')],
      ], // Example Indian Plate Pattern
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      vehicleSeats: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      vehicleType: ['Car', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Auto-set seats if Bike is selected
    this.vehicleForm.get('vehicleType')?.valueChanges.subscribe((type) => {
      if (type === 'Bike') {
        this.vehicleForm.patchValue({ vehicleSeats: 1 });
      }
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.isSubmitting = true;
      const vehicleData = this.vehicleForm.value;

      // Replace with your actual Node.js API endpoint
      this.auth.vehicleRegister(vehicleData).subscribe({
        next: (res) => {
          alert('Vehicle Registered Successfully!');
          this.vehicleForm.reset({ vehicleType: 'Car' });
          this.isSubmitting = false;
          this.router.navigate(['/vehiclelogin']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert('Error registering vehicle');
          this.isSubmitting = false;
        },
      });
    }
  }
}
