import { Routes } from '@angular/router';
import { authGuard } from '../core/guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path:'', 
        component:LoginComponent,
        
    },
    {
        path:'login', 
        component:LoginComponent,
        
    },
    {
        path:'dashboard', 
        component:DashboardComponent,
        canActivate: [authGuard],
    }
];
