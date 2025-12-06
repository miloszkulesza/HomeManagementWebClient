import { Routes } from '@angular/router';
import { Auth } from './core/auth/auth';
import { AuthGuard } from './auth-guard';
import { Profile } from './core/home-management/components/profile/profile';
import { Layout } from './core/home-management/components/layout/layout';
import { Calendar } from './core/home-management/components/calendar/calendar';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'calendar' },
    { path: 'login', component: Auth },
    { 
        path: '', 
        component: Layout, 
        canActivate: [AuthGuard],
        children: [
            { path: 'calendar', component: Calendar },
            { path: 'profile', component: Profile }
        ]
    }
];
