import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Ride } from '../../core/services/ride';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-ride-form',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './ride-form.html',
  styleUrl: './ride-form.scss',
})
export class RideForm implements OnInit {
  rideForm!: FormGroup;
  today = new Date();
  allVehicles: any[] = []; // Array to hold the JSON data
  filteredVehicles: any[] = [];
  // This is just your path string
  private jsonPath: any = './assets/data/vehicle.json';
  existingRides: any[] = []; // To store rides from DB
  currentMaxSeats = 0;

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private rideService: Ride,
    private http: HttpClient,
    private auth: Auth,
  ) {
    this.rideForm = this.fb.group({
      employeeId: [localStorage.getItem('empId'), [Validators.required]],
      vehicleType: ['Bike', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: ['', [Validators.required, Validators.min(1)]],

      // FIX: Place the custom validator inside the second argument array
      time: ['', [Validators.required, this.timeRangeValidator()]],

      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required],
    });

    // Auto-update seats for Bike selection
    this.rideForm.get('vehicleType')?.valueChanges.subscribe((type) => {
      if (type === 'Bike') this.rideForm.patchValue({ vacantSeats: 1 });
    });
  }

  ngOnInit(): void {
    console.log('Ride Form Initialized', this.jsonPath);
    // 1. Fetch JSON and DB data simultaneously
    this.http.get<any>('./assets/data/vehicle.json').subscribe((data) => {
      this.allVehicles = data.vehicles;

      // 2. Fetch existing rides to check availability
      this.auth.getRides().subscribe((dbRides) => {
        this.existingRides = dbRides;
        this.updateVehicleSuggestions(this.rideForm.get('vehicleType')?.value);
      });
    });
    // Listen for type changes
    this.rideForm.get('vehicleType')?.valueChanges.subscribe((type) => {
      this.updateVehicleSuggestions(type);
      this.rideForm.get('vehicleNo')?.reset('');
    });

    // 3. AUTO-CALCULATE REMAINING SEATS
    // this.rideForm.get('vehicleNo')?.valueChanges.subscribe((val) => {
    //   const vehicleData = this.allVehicles.find((v) => v['Vehicle No'] === val);
    //   if (vehicleData) {
    //     const bookedSeats = this.getBookedSeatsCount(val);
    //     const remaining = vehicleData.maxSeats - bookedSeats;

    //     // Patch the remaining seats to the form
    //     this.rideForm.patchValue({ vacantSeats: remaining });
    //   }
    // });

    // this.rideForm.get('vehicleNo')?.valueChanges.subscribe((val) => {
    //   const vehicleData = this.allVehicles.find((v) => v['Vehicle No'] === val);

    //   if (vehicleData) {
    //     const booked = this.getBookedSeatsCount(val);
    //     this.currentMaxSeats = vehicleData.maxSeats - booked;

    //     // 3. Update the form value and set the dynamic validator
    //     const seatsControl = this.rideForm.get('vacantSeats');
    //     seatsControl?.setValidators([
    //       Validators.required,
    //       Validators.min(1),
    //       Validators.max(this.currentMaxSeats), // Dynamic limit
    //     ]);

    //     this.rideForm.patchValue({ vacantSeats: this.currentMaxSeats });
    //     seatsControl?.updateValueAndValidity(); // Refresh validation state
    //   }
    // });
    // 2. Update the vehicleNo listener logic
    this.rideForm.get('vehicleNo')?.valueChanges.subscribe((val) => {
      const vehicleData = this.allVehicles.find((v) => v['Vehicle No'] === val);
      console.log('Selected Vehicle Data:', vehicleData);
      if (vehicleData) {
        const booked = this.getBookedSeatsCount(val);

        // 1. Calculate the variable first
        this.currentMaxSeats = Math.max(0, vehicleData.maxSeats - booked);
        console.log(
          booked,
          'Current Max Seats:',
          this.currentMaxSeats,
          vehicleData.maxSeats,
          'data',
          vehicleData.maxSeats - booked,
        );

        // 2. Then update the form control and validators
        const seatsControl = this.rideForm.get('vacantSeats');
        if (seatsControl) {
          seatsControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(this.currentMaxSeats),
          ]);

          // Patch value only if the current value is invalid or 0
          this.rideForm.patchValue({ vacantSeats: this.currentMaxSeats });
          seatsControl.updateValueAndValidity();
        }
      }
    });
  }

  // Logic to check how many seats are already booked for today
  getBookedSeatsCount(vehicleNo: string): number {
    if (!this.existingRides || this.existingRides.length === 0) return 0;

    const todayStr = new Date().toDateString();
    // console.log(this.existingRides, 'existingRides');
    return this.existingRides
      .filter((ride) => {
        // Ensure we match vehicle AND today's date
        const rideDate = new Date(ride.rideTime).toDateString();
        return ride.vehicleNo === vehicleNo && rideDate === todayStr;
      })
      .reduce((sum, ride) => sum + (Number(ride.seats) || 0), 0);
  }

  updateVehicleSuggestions(type: string) {
    // filter() now works because allVehicles is an Array
    // this.filteredVehicles = this.allVehicles.filter((v: any) => v.type === type);
    this.filteredVehicles = this.allVehicles.filter((v: any) => {
      const isTypeMatch = v.type === type;
      const bookedSeats = this.getBookedSeatsCount(v['Vehicle No']);
      const isAvailable = bookedSeats < v.maxSeats; // Only show if not fully booked

      return isTypeMatch && isAvailable;
    });
  }

  formatRideTime(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  onSubmit() {
    if (this.rideForm.valid) {
      const rawForm = this.rideForm.getRawValue();

      // Create a Date object for today and set the hours/minutes from the form
      const [hours, minutes] = rawForm.time.split(':').map(Number);
      const rideDateObj = new Date();
      rideDateObj.setHours(hours, minutes, 0, 0);

      // Map Angular form keys to Node.js API keys
      const finalRideData = {
        empId: rawForm.employeeId,
        vehicleType: rawForm.vehicleType,
        vehicleNo: rawForm.vehicleNo,
        source: rawForm.pickupPoint,
        destination: rawForm.destination,
        rideTime: this.formatRideTime(rideDateObj), // Sent as ISO string for backend parsing
        seats: rawForm.vacantSeats,
      };

      console.log('Sending to Backend:', finalRideData);

      // 2. Call the service to save in MongoDB
      this.auth.addRide(finalRideData).subscribe({
        next: (res) => {
          alert('Ride added successfully to Database!');
          this.rideForm.reset({
            employeeId: localStorage.getItem('empId'),
            vehicleType: 'Bike',
            vacantSeats: 1,
          });
        },
        error: (err) => {
          console.error('Database Error:', err);
          alert(err.error.msg || 'Error saving ride');
        },
      });
    }
  }

  getFormErrors() {
    const errors: any = {};
    Object.keys(this.rideForm.controls).forEach((key) => {
      const controlErrors = this.rideForm.get(key)?.errors;
      if (controlErrors != null) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Get current time details
      const now = new Date();
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

      // Parse the input time "HH:mm"
      const [hours, minutes] = value.split(':').map(Number);
      const selectedTotalMinutes = hours * 60 + minutes;

      // Calculate the gap
      const minuteDifference = Math.abs(selectedTotalMinutes - currentTotalMinutes);

      // If difference > 60, it's invalid
      if (minuteDifference > 60) {
        return { timeOutRange: true };
      }

      return null;
    };
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Use OpenStreetMap's Nominatim API to get the address
          this.getAddressFromCoords(lat, lng);
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Could not get your location. Please check permissions.');
        },
        { enableHighAccuracy: true },
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  getAddressFromCoords(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        // The 'display_name' contains the full address string
        const fullAddress = data.display_name;

        // Patch the address into your 'pickupPoint' or 'destination' form control
        this.rideForm.patchValue({
          pickupPoint: fullAddress,
        });
      },
      error: (err) => console.error('Address lookup failed', err),
    });
  }
}
