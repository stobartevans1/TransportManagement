import { Routes } from '@angular/router';
import { RideForm } from './features/ride-form/ride-form';
import { Register } from './features/EMP/register/register';
import { Login } from './features/EMP/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { RideSearch } from './features/ride-search/ride-search';
import { Vlogin } from './vehicle/vlogin/vlogin';
import { VRegister } from './vehicle/vregister/vregister';
import { Welcome } from './features/welcome/welcome';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'rides', component: RideForm },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'pick-ride', component: RideSearch },
  { path: 'vehiclelogin', component: Vlogin },
  { path: 'vehicleRegister', component: VRegister },
  { path: 'welcome', component: Welcome },
];
