import { Routes } from '@angular/router';
import { Auth } from './core/auth/auth';
import { AuthGuard } from './auth-guard';
import { HomeManagement } from './core/home-management/home-management';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'home', component: HomeManagement, canActivate: [AuthGuard]},
    {path: 'login', component: Auth}
];
