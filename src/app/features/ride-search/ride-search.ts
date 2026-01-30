import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ride-search',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './ride-search.html',
  styleUrl: './ride-search.scss',
})
export class RideSearch implements OnInit {
  allRides: any[] = [];
  groupedRides: { date: string; rides: any[] }[] = [];

  // Filter variables
  selectedType: string = 'All';
  prefTime: string = '';

  /**
   *
   */
  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.auth.getRides().subscribe((data) => {
      const currentEmpId = localStorage.getItem('empId');

      // Filter out only the user's own rides, keep all dates
      this.allRides = data.filter((r: any) => r.empId !== currentEmpId);
      this.applyFilters();
    });
  }

  applyFilters() {
    const filtered = this.allRides.filter((ride) => {
      const typeMatch = this.selectedType === 'All' || ride.vehicleType === this.selectedType;

      let timeMatch = true;
      if (this.prefTime) {
        const rideMin = this.getMinutes(
          new Date(ride.rideTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        );
        const prefMin = this.getMinutes(this.prefTime);
        timeMatch = Math.abs(rideMin - prefMin) <= 60;
      }
      return typeMatch && timeMatch && ride.seats > 0;
    });

    this.groupRidesByDate(filtered);
  }

  // private groupRidesByDate(rides: any[]) {
  //   const groups = rides.reduce((acc: any, ride) => {
  //     const date = new Date(ride.rideTime).toDateString();
  //     if (!acc[date]) {
  //       acc[date] = [];
  //     }
  //     acc[date].push(ride);
  //     return acc;
  //   }, {});

  //   // Convert object to sorted array
  //   this.groupedRides = Object.keys(groups)
  //     .map((date) => ({
  //       date,
  //       rides: groups[date],
  //     }))
  //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  // }

  private groupRidesByDate(rides: any[]) {
    const groups: Record<string, any[]> = {};

    rides.forEach((ride) => {
      // Extract date only (UTC-safe)
      const dateKey = new Date(ride.rideTime).toISOString().split('T')[0];

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(ride);
    });

    this.groupedRides = Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        rides: groups[date],
      }));
  }

  private getMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  onBookRide(ride: any) {
    alert(`Ride booked successfully for ${new Date(ride.rideTime).toLocaleString()}!`);
    // Here you would typically call a service to update the ride's seat count
  }
}
