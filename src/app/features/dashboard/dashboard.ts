import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  /**
   *
   *
   */

  // Dynamic menu items
  dashboardActions = [
    {
      title: 'Book a New Ride',
      description: 'Schedule a trip or request a delivery instantly.',
      icon: '🚗',
      route: '/rides',
      color: '#764ba2',
    },
    {
      title: 'Pick a Ride',
      description: 'Find colleagues traveling your way and join a ride.',
      icon: '🔍',
      route: '/pick-ride', // Ensure this matches your route in app.routes.ts
      color: '#3498db', // A nice blue color to differentiate it
    },
    {
      title: 'Ride History',
      description: 'View your past trips, receipts, and tracking logs.',
      icon: '📜',
      route: '/history',
      color: '#27ae60',
    },
    {
      title: 'Active Orders',
      description: 'Track your current delivery or ride in real-time.',
      icon: '📍',
      route: '/active-orders',
      color: '#e67e22',
    },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
