import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RideInfo } from '../models/ride/rideinfo.model';

@Injectable({
  providedIn: 'root',
})
export class Ride {
  private rides = new BehaviorSubject<RideInfo[]>([]);
  rides$ = this.rides.asObservable();

  addRide(newRide: RideInfo) {
    const current = this.rides.value;
    // Check if Employee ID is unique for adding
    if (current.find((r) => r.employeeId === newRide.employeeId)) {
      alert('This Employee ID has already offered a ride today.');
      return;
    }
    this.rides.next([...current, newRide]);
  }

  bookRide(rideId: number, bookerId: string) {
    const current = this.rides.value;
    const index = current.findIndex((r) => r.id === rideId);

    if (index !== -1) {
      const ride = current[index];

      // Validation: Same employee cannot book their own ride
      if (ride.employeeId === bookerId) return alert('You cannot book your own ride.');
      // Validation: Cannot book twice
      if (ride.passengers.includes(bookerId)) return alert('You already booked this ride.');
      // Validation: Seats available
      if (ride.vacantSeats <= 0) return alert('No seats available.');

      ride.vacantSeats -= 1;
      ride.passengers.push(bookerId);
      this.rides.next([...current]);
    }
  }
}
