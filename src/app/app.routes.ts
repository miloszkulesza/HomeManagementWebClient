import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'calendar' },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/auth').then(m => m.Auth)
    },
    { 
        path: '', 
        loadComponent: () => import('./core/home-management/components/layout/layout').then(m => m.Layout),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'calendar',
                loadComponent: () => import('./core/home-management/components/calendar/calendar').then(m => m.Calendar)
            },
            {
                path: 'tasks',
                loadComponent: () => import('./core/home-management/components/work-items/work-items').then(m => m.WorkItems)
            },
            {
                path: 'profile',
                loadComponent: () => import('./core/home-management/components/profile/profile').then(m => m.Profile)
            }
        ]
    }
];
