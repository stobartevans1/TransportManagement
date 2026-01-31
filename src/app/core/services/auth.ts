import { Injectable, inject } from '@angular/core';
import { Employee } from '../models/ride/employee.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private storageKey = 'employees';

  // private apiUrl = 'http://localhost:5000/api/';
  private apiUrl = 'https://transport-managermant-2.onrender.com/api/';
  

  constructor(private http: HttpClient) {}

  // Registration now returns an Observable
  register(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, employee);
  }

  // Login sends credentials to the backend
  login(credentials: { mobile: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, credentials);
  }

  addRide(rideData: any): Observable<any> {
    // return this.http.post(this.apiUrl, rideData);
    return this.http.post(`${this.apiUrl}rides/add-ride`, rideData);
  }

  getRides(): Observable<any> {
    return this.http.get(`${this.apiUrl}rides/all`);
  }

  vehicleRegister(vehicleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}vehicles/register`, vehicleData);
  }
  vehicleLogin(credentials: { identifier: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}vehicles/login`, credentials);
  }
}
